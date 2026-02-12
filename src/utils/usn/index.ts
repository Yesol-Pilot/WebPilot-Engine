/**
 * USN (Universal Scale Normalization) 시스템
 * 
 * 통합 내보내기 모듈
 * 
 * Phase 1: PCA 기반 축 정렬
 * Phase 2: OBB (Oriented Bounding Box)
 * Phase 3: 기하학적 자동 분류
 * Phase 4: 시맨틱 검색 (Feature Vector)
 */

// Phase 1: PCA 축 정렬
export {
    computeCentroid,
    extractVertices,
    computeCovarianceMatrix,
    jacobiEigenDecomposition,
    performPCAAlignment,
    applyPCAAlignment,
    validateAlignment,
    buildRotationMatrix,
    debugCovarianceMatrix,
    debugEigenDecomposition,
    type SymmetricMatrix3,
    type EigenDecomposition,
    type PCAAlignmentResult
} from '../PCAAxisAlignment';

// Phase 2: OBB
export {
    computeOBB,
    computeOBBFromScene,
    compareBoundingBoxes,
    generateBoundingBoxReport,
    obbContainsPoint,
    obbIntersectsOBB,
    createOBBHelper,
    type OBB,
    type BoundingBoxComparison,
    type OBBOptions
} from '../OrientedBoundingBox';

// Phase 3: 기하학적 분류
export {
    classifyGeometry,
    classifyScene,
    generateClassificationReport,
    type GeometricClassification,
    type ShapeType,
    type AspectRatioAnalysis,
    type ComplexityAnalysis,
    type DensityAnalysis
} from '../GeometricClassifier';

// Phase 4: 시맨틱 검색 (Feature Vector)
export {
    createFeatureVector,
    createFeatureVectorFromGeometry,
    calculateSimilarity,
    calculateDistance,
    calculateWeightedSimilarity,
    featureVectorToArray,
    arrayToFeatureVector,
    assetRegistry,
    generateSimilarityReport,
    type GeometricFeatureVector,
    type SimilaritySearchResult,
    type AssetRegistryEntry
} from '../GeometricFeatureVector';

// 기존 정규화 함수
export { normalizeGLBScale } from '../normalizeGLBScale';
export { computeRobustBoundingBox } from '../computeRobustBoundingBox';

// Phase 5: 실시간 최적화
export {
    LODAssigner,
    quickAssignLOD,
    getComplexityRating,
    generateLODReport,
    type LODLevel,
    type LODConfig,
    type LODAssignment,
    type LODGroupOptions
} from './LODAssigner';

// Phase 6: 품질 자동 검증
export {
    AssetQualityValidator,
    quickValidate,
    getQualityScore,
    generateQualityReportText,
    QualityIssueCode,
    type QualityIssue,
    type QualityReport,
    type ValidationConfig,
    type AutoFixSuggestion,
    type IssueSeverity
} from './AssetQualityValidator';
