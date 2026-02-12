/**
 * TokenBoundAccountService.ts
 * 
 * ERC-6551 Token Bound Accounts (TBA) 서비스
 * 
 * 기능:
 * - NFT에 연결된 스마트 계정 생성
 * - TBA를 통한 자산 보유 및 전송
 * - 계정 상태 조회
 * 
 * 필수 환경 변수:
 * - WEB3_RPC_URL: Ethereum RPC URL (Infura/Alchemy)
 * - WEB3_CHAIN_ID: 체인 ID (1: Mainnet, 11155111: Sepolia)
 * 
 * @see https://eips.ethereum.org/EIPS/eip-6551
 */

import {
    createPublicClient,
    createWalletClient,
    custom,
    http,
    formatEther,
    parseEther,
    encodeAbiParameters,
    keccak256,
    concat,
    toHex,
    type PublicClient,
    type WalletClient,
    type Transport,
    type Chain,
} from 'viem';
import { mainnet, sepolia } from 'viem/chains';

import type {
    Address,
    NFTInfo,
    TokenBoundAccount,
    TransactionResult,
    Web3ServiceConfig,
    WalletState,
} from './types';

// ERC-6551 Registry ABI (핵심 함수만)
const ERC_6551_REGISTRY_ABI = [
    {
        name: 'createAccount',
        type: 'function',
        inputs: [
            { name: 'implementation', type: 'address' },
            { name: 'salt', type: 'bytes32' },
            { name: 'chainId', type: 'uint256' },
            { name: 'tokenContract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
        ],
        outputs: [{ type: 'address' }],
        stateMutability: 'nonpayable',
    },
    {
        name: 'account',
        type: 'function',
        inputs: [
            { name: 'implementation', type: 'address' },
            { name: 'salt', type: 'bytes32' },
            { name: 'chainId', type: 'uint256' },
            { name: 'tokenContract', type: 'address' },
            { name: 'tokenId', type: 'uint256' },
        ],
        outputs: [{ type: 'address' }],
        stateMutability: 'view',
    },
] as const;

// TBA Execute ABI
const TBA_EXECUTE_ABI = [
    {
        name: 'execute',
        type: 'function',
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'data', type: 'bytes' },
            { name: 'operation', type: 'uint8' },
        ],
        outputs: [{ type: 'bytes' }],
        stateMutability: 'payable',
    },
] as const;

// 기본 설정
const DEFAULT_CONFIG: Required<Web3ServiceConfig> = {
    rpcUrl: process.env.WEB3_RPC_URL || 'https://sepolia.infura.io/v3/demo',
    chainId: parseInt(process.env.WEB3_CHAIN_ID || '11155111', 10),
    registryAddress: '0x000000006551c19487814612e58FE06813775758' as Address, // ERC-6551 Registry (공식)
    storyProtocolAddress: '0x0000000000000000000000000000000000000000' as Address,
    mockMode: !process.env.WEB3_RPC_URL, // RPC URL 없으면 Mock 모드
};

// 기본 TBA Implementation (SimpleERC6551Account)
const DEFAULT_IMPLEMENTATION = '0x55266d75D1a14E4572138116aF39863Ed6596E7F' as Address;

/**
 * 체인 정보 가져오기
 */
function getChain(chainId: number): Chain {
    switch (chainId) {
        case 1:
            return mainnet;
        case 11155111:
            return sepolia;
        default:
            return sepolia;
    }
}

/**
 * ERC-6551 Token Bound Account 서비스
 */
export class TokenBoundAccountService {
    private config: Required<Web3ServiceConfig>;
    private walletState: WalletState = { connected: false };
    private accountCache: Map<string, TokenBoundAccount> = new Map();
    private publicClient: PublicClient | null = null;
    private walletClient: WalletClient | null = null;

    constructor(config: Partial<Web3ServiceConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        console.log(`[TBA] 서비스 초기화됨 (Chain: ${this.config.chainId}, Mock: ${this.config.mockMode})`);

        // Public Client 초기화 (읽기 전용)
        if (!this.config.mockMode) {
            this.publicClient = createPublicClient({
                chain: getChain(this.config.chainId),
                transport: http(this.config.rpcUrl),
            });
            console.log('[TBA] Public Client 초기화 완료');
        }
    }

    /**
     * TBA 주소 계산 (CREATE2 deterministic)
     */
    async computeAccountAddress(nft: NFTInfo): Promise<Address> {
        if (this.config.mockMode) {
            // Mock: 결정론적 가짜 주소 생성
            const hash = this.simpleHash(`${nft.contractAddress}:${nft.tokenId}:${nft.chainId}`);
            return `0x${hash.slice(0, 40)}` as Address;
        }

        if (!this.publicClient) {
            throw new Error('Public Client 미초기화');
        }

        // Registry.account() 호출로 주소 계산
        const salt = '0x0000000000000000000000000000000000000000000000000000000000000000';

        try {
            const address = await this.publicClient.readContract({
                address: this.config.registryAddress as `0x${string}`,
                abi: ERC_6551_REGISTRY_ABI,
                functionName: 'account',
                args: [
                    DEFAULT_IMPLEMENTATION as `0x${string}`,
                    salt as `0x${string}`,
                    BigInt(nft.chainId),
                    nft.contractAddress as `0x${string}`,
                    BigInt(nft.tokenId),
                ],
            });

            return address as Address;
        } catch (error) {
            console.error('[TBA] 주소 계산 실패:', error);
            throw error;
        }
    }

    /**
     * TBA 생성 (배포)
     */
    async createAccount(nft: NFTInfo): Promise<TransactionResult> {
        if (this.config.mockMode) {
            const accountAddress = await this.computeAccountAddress(nft);
            console.log(`[TBA] Mock 계정 생성: ${accountAddress}`);

            const account: TokenBoundAccount = {
                address: accountAddress,
                nft,
                balance: '0',
                ownedNFTs: [],
                isDeployed: true,
            };

            this.accountCache.set(this.getNFTKey(nft), account);

            return {
                hash: `0x${this.simpleHash(Date.now().toString())}`,
                status: 'confirmed',
                blockNumber: 12345678,
                gasUsed: '150000',
            };
        }

        if (!this.walletClient || !this.publicClient) {
            throw new Error('지갑이 연결되지 않음');
        }

        const salt = '0x0000000000000000000000000000000000000000000000000000000000000000';

        try {
            // Registry.createAccount() 호출
            const { request } = await this.publicClient.simulateContract({
                account: this.walletState.address as `0x${string}`,
                address: this.config.registryAddress as `0x${string}`,
                abi: ERC_6551_REGISTRY_ABI,
                functionName: 'createAccount',
                args: [
                    DEFAULT_IMPLEMENTATION as `0x${string}`,
                    salt as `0x${string}`,
                    BigInt(nft.chainId),
                    nft.contractAddress as `0x${string}`,
                    BigInt(nft.tokenId),
                ],
            });

            const hash = await this.walletClient.writeContract(request);
            console.log(`[TBA] 계정 생성 트랜잭션: ${hash}`);

            // 트랜잭션 확인 대기
            const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

            const accountAddress = await this.computeAccountAddress(nft);
            const account: TokenBoundAccount = {
                address: accountAddress,
                nft,
                balance: '0',
                ownedNFTs: [],
                isDeployed: true,
            };
            this.accountCache.set(this.getNFTKey(nft), account);

            return {
                hash,
                status: receipt.status === 'success' ? 'confirmed' : 'failed',
                blockNumber: Number(receipt.blockNumber),
                gasUsed: receipt.gasUsed.toString(),
            };
        } catch (error) {
            console.error('[TBA] 계정 생성 실패:', error);
            throw error;
        }
    }

    /**
     * TBA 정보 조회
     */
    async getAccount(nft: NFTInfo): Promise<TokenBoundAccount | null> {
        const key = this.getNFTKey(nft);

        if (this.accountCache.has(key)) {
            return this.accountCache.get(key)!;
        }

        if (this.config.mockMode) {
            return null;
        }

        if (!this.publicClient) {
            throw new Error('Public Client 미초기화');
        }

        try {
            const address = await this.computeAccountAddress(nft);
            const code = await this.publicClient.getCode({ address: address as `0x${string}` });

            if (!code || code === '0x') {
                return null; // 배포되지 않음
            }

            const balance = await this.getBalance(address);

            const account: TokenBoundAccount = {
                address,
                nft,
                balance,
                ownedNFTs: [],
                isDeployed: true,
            };

            this.accountCache.set(key, account);
            return account;
        } catch (error) {
            console.error('[TBA] 계정 조회 실패:', error);
            return null;
        }
    }

    /**
     * TBA 잔액 조회
     */
    async getBalance(accountAddress: Address): Promise<string> {
        if (this.config.mockMode) {
            return '0.5'; // Mock 잔액 (ETH)
        }

        if (!this.publicClient) {
            throw new Error('Public Client 미초기화');
        }

        try {
            const balance = await this.publicClient.getBalance({
                address: accountAddress as `0x${string}`,
            });
            return formatEther(balance);
        } catch (error) {
            console.error('[TBA] 잔액 조회 실패:', error);
            return '0';
        }
    }

    /**
     * TBA를 통한 트랜잭션 실행
     */
    async executeTransaction(
        accountAddress: Address,
        to: Address,
        value: string,
        data: string
    ): Promise<TransactionResult> {
        if (this.config.mockMode) {
            console.log(`[TBA] Mock 트랜잭션: ${accountAddress} -> ${to}`);
            return {
                hash: `0x${this.simpleHash(Date.now().toString())}`,
                status: 'confirmed',
            };
        }

        if (!this.walletClient || !this.publicClient) {
            throw new Error('지갑이 연결되지 않음');
        }

        try {
            const { request } = await this.publicClient.simulateContract({
                account: this.walletState.address as `0x${string}`,
                address: accountAddress as `0x${string}`,
                abi: TBA_EXECUTE_ABI,
                functionName: 'execute',
                args: [
                    to as `0x${string}`,
                    parseEther(value),
                    (data || '0x') as `0x${string}`,
                    0, // CALL operation
                ],
            });

            const hash = await this.walletClient.writeContract(request);
            console.log(`[TBA] 트랜잭션 전송: ${hash}`);

            const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

            return {
                hash,
                status: receipt.status === 'success' ? 'confirmed' : 'failed',
                blockNumber: Number(receipt.blockNumber),
                gasUsed: receipt.gasUsed.toString(),
            };
        } catch (error) {
            console.error('[TBA] 트랜잭션 실행 실패:', error);
            throw error;
        }
    }

    /**
     * 지갑 연결 (브라우저 환경)
     */
    async connectWallet(): Promise<WalletState> {
        if (this.config.mockMode) {
            this.walletState = {
                connected: true,
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1e123' as Address,
                chainId: this.config.chainId,
                balance: '1.5',
            };
            console.log(`[TBA] Mock 지갑 연결: ${this.walletState.address}`);
            return this.walletState;
        }

        // 브라우저 환경 확인
        if (typeof window === 'undefined' || !(window as any).ethereum) {
            throw new Error('MetaMask 또는 Web3 지갑을 설치해주세요');
        }

        try {
            const ethereum = (window as any).ethereum;

            // 계정 연결 요청
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const address = accounts[0] as Address;

            // 체인 ID 확인
            const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
            const chainId = parseInt(chainIdHex, 16);

            // 필요시 체인 전환
            if (chainId !== this.config.chainId) {
                console.warn(`[TBA] 체인 불일치: 현재 ${chainId}, 필요 ${this.config.chainId}`);
            }

            // Wallet Client 생성
            this.walletClient = createWalletClient({
                account: address as `0x${string}`,
                chain: getChain(this.config.chainId),
                transport: custom(ethereum),
            });

            // 잔액 조회
            const balance = await this.getBalance(address);

            this.walletState = {
                connected: true,
                address,
                chainId,
                balance,
            };

            console.log(`[TBA] ✅ 지갑 연결 완료: ${address} (Chain: ${chainId})`);
            return this.walletState;
        } catch (error) {
            console.error('[TBA] 지갑 연결 실패:', error);
            throw error;
        }
    }

    /**
     * 지갑 연결 해제
     */
    disconnectWallet(): void {
        this.walletState = { connected: false };
        this.walletClient = null;
        console.log('[TBA] 지갑 연결 해제됨');
    }

    /**
     * 현재 지갑 상태
     */
    getWalletState(): WalletState {
        return { ...this.walletState };
    }

    /**
     * Mock 모드 여부
     */
    isMockMode(): boolean {
        return this.config.mockMode;
    }

    // ========== Private Methods ==========

    private getNFTKey(nft: NFTInfo): string {
        return `${nft.chainId}:${nft.contractAddress}:${nft.tokenId}`;
    }

    private simpleHash(input: string): string {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(40, '0');
    }
}

// 싱글톤
let instance: TokenBoundAccountService | null = null;

export function getTokenBoundAccountService(
    config?: Partial<Web3ServiceConfig>
): TokenBoundAccountService {
    if (!instance) {
        instance = new TokenBoundAccountService(config);
    }
    return instance;
}

export default TokenBoundAccountService;

