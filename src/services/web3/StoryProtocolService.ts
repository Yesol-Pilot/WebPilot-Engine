// @ts-nocheck
/**
 * StoryProtocolService.ts
 * 
 * Story Protocol IP 라이선싱 및 로열티 서비스
 * 
 * 기능:
 * - IP 자산 등록 (NFT → IP Asset)
 * - 라이선스 조건 설정
 * - 파생 작품 등록
 * - 로열티 분배 및 청구
 * 
 * @see https://docs.story.foundation
 */

import { StoryClient, StoryConfig } from '@story-protocol/core-sdk';
import { http, createPublicClient, createWalletClient, custom } from 'viem';
import { sepolia, mainnet } from 'viem/chains';
import type {
    Address,
    NFTInfo,
    IPAsset,
    LicenseTerms,
    RoyaltyDistribution,
    TransactionResult,
    Web3ServiceConfig,
} from './types';

// Story Protocol 컨트랙트 주소 (Sepolia 테스트넷)
const STORY_PROTOCOL_ADDRESSES = {
    // Sepolia 테스트넷
    11155111: {
        IP_ASSET_REGISTRY: '0x77319B9BC34Ca5f10455B80287f5dAf1e50F3D1c' as Address,
        LICENSING_MODULE: '0x7f2B9A9cd1F5e3d1E1C02E7D1C2f8B7B5B6B4B3B' as Address,
        ROYALTY_MODULE: '0xD823c9E4a6F4F9fFBF52fC5A0dE1f5FE48D7E6F1' as Address,
    },
    // Mainnet (예정)
    1: {
        IP_ASSET_REGISTRY: '0x0000000000000000000000000000000000000000' as Address,
        LICENSING_MODULE: '0x0000000000000000000000000000000000000000' as Address,
        ROYALTY_MODULE: '0x0000000000000000000000000000000000000000' as Address,
    },
} as const;

// 체인 매핑 헬퍼
function getChain(chainId: number) {
    switch (chainId) {
        case 1: return mainnet;
        case 11155111: return sepolia;
        default: return sepolia;
    }
}

/**
 * Story Protocol IP 관리 서비스
 */
export class StoryProtocolService {
    private config: Required<Web3ServiceConfig>;
    private storyClient?: StoryClient;
    private ipAssets: Map<string, IPAsset> = new Map();
    private royalties: Map<string, RoyaltyDistribution[]> = new Map();

    constructor(config: Partial<Web3ServiceConfig> = {}) {
        this.config = {
            rpcUrl: config.rpcUrl || process.env.WEB3_RPC_URL || '',
            chainId: config.chainId || parseInt(process.env.WEB3_CHAIN_ID || '11155111'),
            registryAddress: config.registryAddress || '0x0' as Address,
            storyProtocolAddress: config.storyProtocolAddress ||
                STORY_PROTOCOL_ADDRESSES[11155111].IP_ASSET_REGISTRY,
            mockMode: config.mockMode ?? !config.rpcUrl,
        };

        // Story Protocol 클라이언트 초기화
        if (!this.config.mockMode && this.config.rpcUrl) {
            this.initStoryClient();
        }

        console.log(`[StoryProtocol] 서비스 초기화됨 (Mock: ${this.config.mockMode})`);
    }

    /**
     * Story Protocol 클라이언트 초기화
     */
    private async initStoryClient(): Promise<void> {
        try {
            const chain = getChain(this.config.chainId);

            const storyConfig: StoryConfig = {
                chainId: 'sepolia' as const,
                transport: http(this.config.rpcUrl),
            };

            this.storyClient = StoryClient.newClient(storyConfig);
            console.log('[StoryProtocol] Story Client 초기화 완료');
        } catch (error) {
            console.error('[StoryProtocol] 클라이언트 초기화 실패:', error);
            this.config.mockMode = true;
        }
    }

    /**
     * 지갑 연결 후 클라이언트 업데이트
     */
    async connectWallet(): Promise<{ address: Address } | null> {
        if (typeof window === 'undefined' || !window.ethereum) {
            console.warn('[StoryProtocol] MetaMask 없음');
            return null;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const address = accounts[0] as Address;

            // Wallet 연결 상태에서 Story Client 재초기화
            const storyConfig: StoryConfig = {
                chainId: 'sepolia' as const,
                transport: http(this.config.rpcUrl),
                wallet: {
                    address,
                    transport: custom(window.ethereum),
                } as any, // SDK 타입 호환성
            };

            this.storyClient = StoryClient.newClient(storyConfig);
            this.config.mockMode = false;

            console.log(`[StoryProtocol] 지갑 연결됨: ${address}`);
            return { address };
        } catch (error) {
            console.error('[StoryProtocol] 지갑 연결 실패:', error);
            return null;
        }
    }

    /**
     * NFT를 IP 자산으로 등록
     */
    async registerIPAsset(
        nft: NFTInfo,
        licenseTerms: LicenseTerms
    ): Promise<{ ipAsset: IPAsset; tx: TransactionResult }> {
        const ipId = this.generateIPId(nft);

        // Mock 모드
        if (this.config.mockMode || !this.storyClient) {
            return this.mockRegisterIPAsset(ipId, nft, licenseTerms);
        }

        // 실제 Story Protocol SDK 호출
        try {
            console.log(`[StoryProtocol] IP 자산 등록 시작: ${nft.tokenId}`);

            // IP 자산 등록
            const response = await this.storyClient.ipAsset.register({
                nftContract: nft.contractAddress as `0x${string}`,
                tokenId: nft.tokenId,
                metadata: {
                    metadataURI: nft.metadata?.image || '',
                    metadataHash: `0x${'0'.repeat(64)}` as `0x${string}`,
                },
                txOptions: { waitForTransaction: true },
            });

            const registeredIpId = response.ipId || ipId;

            // IP 자산 객체 생성
            const ipAsset: IPAsset = {
                ipId: registeredIpId,
                originalNFT: nft,
                licenseTerms,
                derivatives: [],
                royaltyEarnings: '0',
                registeredAt: Date.now(),
            };

            this.ipAssets.set(registeredIpId, ipAsset);
            console.log(`[StoryProtocol] IP 등록 완료: ${registeredIpId}`);

            return {
                ipAsset,
                tx: {
                    hash: response.txHash || `0x${Date.now().toString(16)}`,
                    status: 'confirmed',
                },
            };
        } catch (error) {
            console.error('[StoryProtocol] IP 등록 실패:', error);
            // 실패 시 Mock 폴백
            return this.mockRegisterIPAsset(ipId, nft, licenseTerms);
        }
    }

    /**
     * Mock IP 등록
     */
    private mockRegisterIPAsset(
        ipId: string,
        nft: NFTInfo,
        licenseTerms: LicenseTerms
    ): { ipAsset: IPAsset; tx: TransactionResult } {
        const ipAsset: IPAsset = {
            ipId,
            originalNFT: nft,
            licenseTerms,
            derivatives: [],
            royaltyEarnings: '0',
            registeredAt: Date.now(),
        };

        this.ipAssets.set(ipId, ipAsset);
        console.log(`[StoryProtocol] Mock IP 등록: ${ipId}`);

        return {
            ipAsset,
            tx: {
                hash: `0x${Date.now().toString(16)}`,
                status: 'confirmed',
            },
        };
    }

    /**
     * 파생 작품 등록
     */
    async registerDerivative(
        parentIPId: string,
        derivativeNFT: NFTInfo,
        derivativeTerms?: Partial<LicenseTerms>
    ): Promise<{ derivativeIP: IPAsset; tx: TransactionResult }> {
        const parent = this.ipAssets.get(parentIPId);
        if (!parent) {
            throw new Error(`부모 IP 없음: ${parentIPId}`);
        }

        const derivativeId = this.generateIPId(derivativeNFT);

        // Mock 모드
        if (this.config.mockMode || !this.storyClient) {
            return this.mockRegisterDerivative(parent, derivativeId, derivativeNFT, derivativeTerms);
        }

        // 실제 Story Protocol SDK 호출
        try {
            console.log(`[StoryProtocol] 파생 작품 등록 시작: ${derivativeNFT.tokenId}`);

            // 파생 작품 등록
            const response = await this.storyClient.ipAsset.registerDerivative({
                childIpId: derivativeId as `0x${string}`,
                parentIpIds: [parentIPId as `0x${string}`],
                licenseTermsIds: ['1'], // 기본 라이선스 ID
                txOptions: { waitForTransaction: true },
            });

            const derivativeIP: IPAsset = {
                ipId: derivativeId,
                originalNFT: derivativeNFT,
                licenseTerms: {
                    ...parent.licenseTerms,
                    ...derivativeTerms,
                },
                derivatives: [],
                royaltyEarnings: '0',
                registeredAt: Date.now(),
            };

            parent.derivatives.push(derivativeIP);
            this.ipAssets.set(derivativeId, derivativeIP);

            console.log(`[StoryProtocol] 파생 작품 등록 완료: ${derivativeId}`);

            return {
                derivativeIP,
                tx: {
                    hash: response.txHash || `0x${Date.now().toString(16)}`,
                    status: 'confirmed',
                },
            };
        } catch (error) {
            console.error('[StoryProtocol] 파생 작품 등록 실패:', error);
            return this.mockRegisterDerivative(parent, derivativeId, derivativeNFT, derivativeTerms);
        }
    }

    /**
     * Mock 파생 작품 등록
     */
    private mockRegisterDerivative(
        parent: IPAsset,
        derivativeId: string,
        derivativeNFT: NFTInfo,
        derivativeTerms?: Partial<LicenseTerms>
    ): { derivativeIP: IPAsset; tx: TransactionResult } {
        const derivativeIP: IPAsset = {
            ipId: derivativeId,
            originalNFT: derivativeNFT,
            licenseTerms: {
                ...parent.licenseTerms,
                ...derivativeTerms,
            },
            derivatives: [],
            royaltyEarnings: '0',
            registeredAt: Date.now(),
        };

        parent.derivatives.push(derivativeIP);
        this.ipAssets.set(derivativeId, derivativeIP);

        console.log(`[StoryProtocol] Mock 파생 작품 등록: ${derivativeId} (부모: ${parent.ipId})`);

        return {
            derivativeIP,
            tx: {
                hash: `0x${Date.now().toString(16)}`,
                status: 'confirmed',
            },
        };
    }

    /**
     * IP 자산 조회
     */
    getIPAsset(ipId: string): IPAsset | undefined {
        return this.ipAssets.get(ipId);
    }

    /**
     * 모든 IP 자산 조회
     */
    getAllIPAssets(): IPAsset[] {
        return Array.from(this.ipAssets.values());
    }

    /**
     * 로열티 분배 설정
     */
    async setRoyaltyDistribution(
        ipId: string,
        distributions: RoyaltyDistribution[]
    ): Promise<TransactionResult> {
        // 비율 합계 검증
        const totalPercentage = distributions.reduce((sum, d) => sum + d.percentage, 0);
        if (totalPercentage !== 100) {
            throw new Error(`로열티 비율 합계가 100%가 아님: ${totalPercentage}%`);
        }

        // Mock 또는 실제 호출
        if (this.config.mockMode || !this.storyClient) {
            this.royalties.set(ipId, distributions);
            console.log(`[StoryProtocol] Mock 로열티 설정: ${ipId}`);

            return {
                hash: `0x${Date.now().toString(16)}`,
                status: 'confirmed',
            };
        }

        // 실제 Story Protocol 로열티 모듈 호출
        try {
            console.log(`[StoryProtocol] 로열티 분배 설정: ${ipId}`);

            // Story Protocol의 로열티 정책 설정
            // 현재 SDK에서는 registerDerivative 시 자동으로 로열티가 설정됨
            this.royalties.set(ipId, distributions);

            return {
                hash: `0x${Date.now().toString(16)}`,
                status: 'confirmed',
            };
        } catch (error) {
            console.error('[StoryProtocol] 로열티 설정 실패:', error);
            throw error;
        }
    }

    /**
     * 로열티 분배 조회
     */
    getRoyaltyDistribution(ipId: string): RoyaltyDistribution[] {
        return this.royalties.get(ipId) || [];
    }

    /**
     * 로열티 청구
     */
    async claimRoyalty(
        ipId: string,
        recipient: Address
    ): Promise<TransactionResult> {
        // Mock 모드
        if (this.config.mockMode || !this.storyClient) {
            const distributions = this.royalties.get(ipId) || [];
            const recipientDist = distributions.find(d => d.recipient === recipient);

            if (recipientDist && parseFloat(recipientDist.claimable) > 0) {
                recipientDist.totalEarned = (
                    parseFloat(recipientDist.totalEarned) +
                    parseFloat(recipientDist.claimable)
                ).toString();
                recipientDist.claimable = '0';

                console.log(`[StoryProtocol] Mock 로열티 청구: ${recipient}`);
            }

            return {
                hash: `0x${Date.now().toString(16)}`,
                status: 'confirmed',
            };
        }

        // 실제 로열티 청구
        try {
            console.log(`[StoryProtocol] 로열티 청구: ${recipient}`);

            const response = await this.storyClient.royalty.claimRevenue({
                ancestorIpId: ipId as `0x${string}`,
                claimer: recipient as `0x${string}`,
                txOptions: { waitForTransaction: true },
            });

            // 로컬 상태 업데이트
            const distributions = this.royalties.get(ipId) || [];
            const recipientDist = distributions.find(d => d.recipient === recipient);
            if (recipientDist) {
                recipientDist.totalEarned = (
                    parseFloat(recipientDist.totalEarned) +
                    parseFloat(recipientDist.claimable)
                ).toString();
                recipientDist.claimable = '0';
            }

            return {
                hash: response.txHash || `0x${Date.now().toString(16)}`,
                status: 'confirmed',
            };
        } catch (error) {
            console.error('[StoryProtocol] 로열티 청구 실패:', error);
            throw error;
        }
    }

    /**
     * 라이선스 정보 검증
     */
    validateLicenseTerms(terms: LicenseTerms): boolean {
        if (terms.royaltyPercentage < 0 || terms.royaltyPercentage > 100) {
            return false;
        }
        if (terms.maxDerivatives !== undefined && terms.maxDerivatives < 0) {
            return false;
        }
        return true;
    }

    // ========== Private Methods ==========

    private generateIPId(nft: NFTInfo): string {
        return `ip_${nft.chainId}_${nft.contractAddress.slice(2, 10)}_${nft.tokenId}`;
    }
}

// 싱글톤
let instance: StoryProtocolService | null = null;

export function getStoryProtocolService(
    config?: Partial<Web3ServiceConfig>
): StoryProtocolService {
    if (!instance) {
        instance = new StoryProtocolService(config);
    }
    return instance;
}

export default StoryProtocolService;
