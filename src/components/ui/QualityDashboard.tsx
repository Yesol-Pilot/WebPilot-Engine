'use client';

/**
 * QualityDashboard.tsx
 * 
 * 검증 결과 대시보드 UI 컴포넌트
 * 
 * 특징:
 * - 실시간 검증 점수 표시
 * - 검증기별 상세 결과
 * - 이슈 목록 및 제안사항
 * - Auto-Fix 적용 현황
 */

import React, { useMemo } from 'react';
import type { QualityReport, ValidationIssue, ValidatorId } from '@/types/ValidationTypes';

// ============================================================
// 스타일 정의
// ============================================================

const styles = {
    container: {
        position: 'fixed' as const,
        bottom: '20px',
        right: '20px',
        width: '360px',
        maxHeight: '70vh',
        backgroundColor: 'rgba(15, 15, 25, 0.95)',
        borderRadius: '12px',
        border: '1px solid rgba(100, 100, 150, 0.3)',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '13px',
        color: '#e0e0e0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 1000
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(100, 100, 150, 0.2)',
        background: 'linear-gradient(135deg, rgba(50, 50, 80, 0.8), rgba(30, 30, 50, 0.8))'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 600
    },
    scoreCircle: (score: number) => ({
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        background: `conic-gradient(
            ${getScoreColor(score)} ${score * 3.6}deg,
            rgba(60, 60, 80, 0.5) 0deg
        )`,
        position: 'relative' as const
    }),
    scoreInner: {
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        backgroundColor: 'rgba(20, 20, 35, 0.95)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scoreValue: {
        fontSize: '18px',
        fontWeight: 700
    },
    verdictBadge: (verdict: string) => ({
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: getVerdictColor(verdict),
        color: '#fff',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px'
    }),
    content: {
        padding: '12px 16px',
        maxHeight: '400px',
        overflowY: 'auto' as const
    },
    section: {
        marginBottom: '16px'
    },
    sectionTitle: {
        fontSize: '11px',
        fontWeight: 600,
        color: '#8888aa',
        textTransform: 'uppercase' as const,
        marginBottom: '8px',
        letterSpacing: '0.5px'
    },
    validatorRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 10px',
        marginBottom: '4px',
        backgroundColor: 'rgba(40, 40, 60, 0.4)',
        borderRadius: '6px'
    },
    validatorName: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    validatorScore: (score: number) => ({
        fontSize: '13px',
        fontWeight: 600,
        color: getScoreColor(score)
    }),
    issueItem: (severity: string) => ({
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        padding: '8px 10px',
        marginBottom: '4px',
        backgroundColor: getSeverityBg(severity),
        borderRadius: '6px',
        borderLeft: `3px solid ${getSeverityColor(severity)}`
    }),
    issueIcon: {
        fontSize: '12px',
        marginTop: '2px'
    },
    issueText: {
        flex: 1,
        fontSize: '12px',
        lineHeight: 1.4
    },
    suggestion: {
        padding: '8px 10px',
        marginBottom: '4px',
        backgroundColor: 'rgba(100, 200, 100, 0.1)',
        borderRadius: '6px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '6px'
    },
    autoFixBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        backgroundColor: 'rgba(100, 200, 255, 0.15)',
        borderRadius: '10px',
        fontSize: '11px',
        color: '#64d8ff'
    },
    footer: {
        padding: '10px 16px',
        borderTop: '1px solid rgba(100, 100, 150, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#888'
    },
    closeButton: {
        position: 'absolute' as const,
        top: '12px',
        right: '12px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: 'rgba(100, 100, 120, 0.3)',
        border: 'none',
        color: '#aaa',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px'
    }
};

// ============================================================
// 유틸리티 함수
// ============================================================

function getScoreColor(score: number): string {
    if (score >= 80) return '#4ade80';
    if (score >= 60) return '#fbbf24';
    return '#f87171';
}

function getVerdictColor(verdict: string): string {
    switch (verdict) {
        case 'APPROVED': return '#16a34a';
        case 'NEEDS_REVISION': return '#d97706';
        case 'REJECTED': return '#dc2626';
        default: return '#6b7280';
    }
}

function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'critical': return '#ef4444';
        case 'major': return '#f97316';
        case 'minor': return '#eab308';
        case 'info': return '#3b82f6';
        default: return '#6b7280';
    }
}

function getSeverityBg(severity: string): string {
    switch (severity) {
        case 'critical': return 'rgba(239, 68, 68, 0.1)';
        case 'major': return 'rgba(249, 115, 22, 0.1)';
        case 'minor': return 'rgba(234, 179, 8, 0.1)';
        case 'info': return 'rgba(59, 130, 246, 0.1)';
        default: return 'rgba(107, 114, 128, 0.1)';
    }
}

function getSeverityIcon(severity: string): string {
    switch (severity) {
        case 'critical': return '🚨';
        case 'major': return '⚠️';
        case 'minor': return '💡';
        case 'info': return 'ℹ️';
        default: return '•';
    }
}

const VALIDATOR_LABELS: Record<ValidatorId, { icon: string; name: string }> = {
    placement: { icon: '📦', name: '배치 검증' },
    performance: { icon: '⚡', name: '성능 검증' },
    object: { icon: '🎯', name: '오브젝트 검증' },
    scenario: { icon: '📜', name: '시나리오 검증' },
    narrative: { icon: '📖', name: '서사 검증' },
    navigation: { icon: '🗺️', name: '이동성 검증' },
    aesthetics: { icon: '🎨', name: '미학 검증' },
    skybox: { icon: '🌅', name: '스카이박스' },
    lighting: { icon: '💡', name: '조명' },
    bgm: { icon: '🎵', name: 'BGM' },
    integration: { icon: '🔗', name: '통합' }
};

// ============================================================
// 컴포넌트 Props
// ============================================================

interface QualityDashboardProps {
    report: QualityReport | null;
    isOpen: boolean;
    onClose: () => void;
}

// ============================================================
// 메인 컴포넌트
// ============================================================

export function QualityDashboard({ report, isOpen, onClose }: QualityDashboardProps) {
    // 통계 계산
    const stats = useMemo(() => {
        if (!report) return null;

        const criticalCount = report.issues.filter(i => i.severity === 'critical').length;
        const majorCount = report.issues.filter(i => i.severity === 'major').length;
        const minorCount = report.issues.filter(i => i.severity === 'minor').length;

        return { criticalCount, majorCount, minorCount };
    }, [report]);

    if (!isOpen || !report) return null;

    return (
        <div style={styles.container}>
            {/* 헤더 */}
            <div style={styles.header}>
                <div style={styles.title}>
                    <span>🛡️</span>
                    <span>품질 검증 결과</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={styles.scoreCircle(report.overallScore)}>
                        <div style={styles.scoreInner}>
                            <span style={styles.scoreValue}>{report.overallScore}</span>
                        </div>
                    </div>
                    <span style={styles.verdictBadge(report.verdict)}>
                        {report.verdict === 'APPROVED' && '✓ 승인'}
                        {report.verdict === 'NEEDS_REVISION' && '⟳ 수정필요'}
                        {report.verdict === 'REJECTED' && '✕ 거부'}
                    </span>
                </div>

                <button style={styles.closeButton} onClick={onClose}>×</button>
            </div>

            {/* 컨텐츠 */}
            <div style={styles.content}>
                {/* 검증기별 점수 */}
                <div style={styles.section}>
                    <div style={styles.sectionTitle}>검증기별 점수</div>
                    {Object.entries(report.breakdown).map(([id, score]) => {
                        const validator = VALIDATOR_LABELS[id as ValidatorId];
                        if (!validator || score === undefined) return null;
                        return (
                            <div key={id} style={styles.validatorRow}>
                                <div style={styles.validatorName}>
                                    <span>{validator.icon}</span>
                                    <span>{validator.name}</span>
                                </div>
                                <span style={styles.validatorScore(score)}>{score}점</span>
                            </div>
                        );
                    })}
                </div>

                {/* 이슈 목록 */}
                {report.issues.length > 0 && (
                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>
                            발견된 이슈 ({report.issues.length})
                        </div>
                        {report.issues.slice(0, 10).map((issue, idx) => (
                            <div key={idx} style={styles.issueItem(issue.severity)}>
                                <span style={styles.issueIcon}>
                                    {getSeverityIcon(issue.severity)}
                                </span>
                                <span style={styles.issueText}>
                                    {issue.message}
                                    {issue.autoFixable && (
                                        <span style={styles.autoFixBadge}>
                                            🔧 Auto-Fix
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                        {report.issues.length > 10 && (
                            <div style={{ color: '#888', fontSize: '11px', textAlign: 'center', marginTop: '4px' }}>
                                + {report.issues.length - 10}개 더...
                            </div>
                        )}
                    </div>
                )}

                {/* 제안사항 */}
                {report.recommendations.length > 0 && (
                    <div style={styles.section}>
                        <div style={styles.sectionTitle}>제안사항</div>
                        {report.recommendations.map((rec, idx) => (
                            <div key={idx} style={styles.suggestion}>
                                <span>💡</span>
                                <span>{rec}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 푸터 */}
            <div style={styles.footer}>
                <span>
                    Auto-Fix: {report.autoFixesApplied}개 적용
                </span>
                <span>
                    {new Date(report.timestamp).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
}

// ============================================================
// 미니 버전 (토글 버튼)
// ============================================================

interface QualityBadgeProps {
    report: QualityReport | null;
    onClick: () => void;
}

export function QualityBadge({ report, onClick }: QualityBadgeProps) {
    if (!report) return null;

    return (
        <button
            onClick={onClick}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '10px 16px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: getVerdictColor(report.verdict),
                color: '#fff',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: 999
            }}
        >
            <span>🛡️</span>
            <span>{report.overallScore}점</span>
            <span style={{ opacity: 0.8 }}>|</span>
            <span>
                {report.verdict === 'APPROVED' && '승인됨'}
                {report.verdict === 'NEEDS_REVISION' && '수정필요'}
                {report.verdict === 'REJECTED' && '거부됨'}
            </span>
        </button>
    );
}

export default QualityDashboard;
