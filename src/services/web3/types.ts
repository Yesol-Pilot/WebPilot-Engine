/**
 * 블록체인/Web3 관련 타입 정의
 * 
 * ERC-6551: Token Bound Accounts (TBA)
 * Story Protocol: IP 라이선싱 및 로열티
 */

/** 지갑 주소 */
export type Address = `0x${string}`;

/** 체인 ID (주요 체인 또는 커스텀) */
export type ChainId = 1 | 5 | 137 | 80001 | 11155111 | number; // mainnet, goerli, polygon, mumbai, sepolia, custom

/** NFT 정보 */
export interface NFTInfo {
    /** 컨트랙트 주소 */
    contractAddress: Address;
    /** 토큰 ID */
    tokenId: string;
    /** 체인 ID */
    chainId: ChainId;
    /** 소유자 주소 */
    owner: Address;
    /** 메타데이터 URI */
    tokenURI?: string;
}

/** ERC-6551 Token Bound Account */
export interface TokenBoundAccount {
    /** TBA 주소 */
    address: Address;
    /** 연결된 NFT */
    nft: NFTInfo;
    /** 계정 잔액 (네이티브 토큰) */
    balance: string;
    /** 계정 내 보유 NFT 목록 */
    ownedNFTs: NFTInfo[];
    /** 계정 생성 여부 */
    isDeployed: boolean;
}

/** Story Protocol IP Asset */
export interface IPAsset {
    /** IP 자산 ID */
    ipId: string;
    /** 원본 NFT */
    originalNFT: NFTInfo;
    /** 라이선스 조건 */
    licenseTerms: LicenseTerms;
    /** 파생 작품 목록 */
    derivatives: IPAsset[];
    /** 로열티 수익 */
    royaltyEarnings: string;
    /** 등록 시간 */
    registeredAt: number;
}

/** 라이선스 조건 */
export interface LicenseTerms {
    /** 라이선스 타입 */
    type: 'commercial' | 'non-commercial' | 'derivative';
    /** 로열티 비율 (0-100) */
    royaltyPercentage: number;
    /** 최대 파생 작품 수 */
    maxDerivatives?: number;
    /** 상업적 사용 허용 */
    commercialUse: boolean;
    /** 추가 조건 */
    additionalTerms?: string;
}

/** 로열티 분배 정보 */
export interface RoyaltyDistribution {
    /** 수혜자 주소 */
    recipient: Address;
    /** 분배 비율 */
    percentage: number;
    /** 누적 수익 */
    totalEarned: string;
    /** 인출 가능 금액 */
    claimable: string;
}

/** 트랜잭션 상태 */
export type TransactionStatus =
    | 'pending'
    | 'confirming'
    | 'confirmed'
    | 'failed';

/** 트랜잭션 결과 */
export interface TransactionResult {
    hash: string;
    status: TransactionStatus;
    blockNumber?: number;
    gasUsed?: string;
    error?: string;
}

/** 서비스 설정 */
export interface Web3ServiceConfig {
    /** RPC URL */
    rpcUrl?: string;
    /** 체인 ID */
    chainId?: ChainId;
    /** ERC-6551 Registry 주소 */
    registryAddress?: Address;
    /** Story Protocol 컨트랙트 주소 */
    storyProtocolAddress?: Address;
    /** Mock 모드 */
    mockMode?: boolean;
}

/** 지갑 연결 상태 */
export interface WalletState {
    connected: boolean;
    address?: Address;
    chainId?: ChainId;
    balance?: string;
}
