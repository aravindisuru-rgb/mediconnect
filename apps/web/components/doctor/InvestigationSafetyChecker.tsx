'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle, X } from 'lucide-react';

interface SafetyCheck {
    type: string;
    severity: 'BLOCKING' | 'WARNING' | 'INFO';
    message: string;
    recommendation: string;
}

interface InvestigationSafetyCheckerProps {
    patientId: string;
    selectedTests: Array<{
        category: string;
        testName: string;
        withContrast?: boolean;
        testType?: string;
    }>;
    onSafetyChange?: (isSafe: boolean) => void;
}

interface PatientSafety {
    hasPacemaker?: boolean;
    hasMetalImplants?: boolean;
    metalImplantDetails?: string;
    hasContrastAllergy?: boolean;
    contrastAllergyType?: string;
    contrastAllergyDetails?: string;
    hasRenalImpairment?: boolean;
    lastEGFR?: number;
    lastCreatinine?: number;
    isPregnant?: boolean;
}

export function InvestigationSafetyChecker({
    patientId,
    selectedTests,
    onSafetyChange
}: InvestigationSafetyCheckerProps) {
    const [safetyChecks, setSafetyChecks] = useState<SafetyCheck[]>([]);
    const [patientSafety, setPatientSafety] = useState<PatientSafety | null>(null);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedTests.length === 0) {
            setSafetyChecks([]);
            onSafetyChange?.(true);
            return;
        }

        fetchSafetyAndCheck();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTests, patientId]);

    const fetchSafetyAndCheck = async () => {
        setLoading(true);
        try {
            // Fetch patient safety screening data
            const safetyRes = await fetch(`/api/patients/${patientId}/safety-screen`);
            const safetyData = safetyRes.ok ? await safetyRes.json() : null;
            setPatientSafety(safetyData);

            // Fetch patient data for age, gender, pregnancy status if needed
            const patientRes = await fetch(`/api/patients/${patientId}`);
            const patientData = patientRes.ok ? await patientRes.json() : null;

            // Perform safety checks
            const checks: SafetyCheck[] = [];

            selectedTests.forEach((test) => {
                // MRI Safety Checks
                if (test.testType === 'MRI' || test.testName?.includes('MRI')) {
                    if (safetyData?.hasPacemaker) {
                        checks.push({
                            type: 'MRI_PACEMAKER',
                            severity: 'BLOCKING',
                            message: '⛔ MRI CONTRAINDICATED: Patient has pacemaker',
                            recommendation: 'MRI is absolutely contraindicated. Consider alternative imaging (CT, Ultrasound).'
                        });
                    }
                    if (safetyData?.hasMetalImplants) {
                        checks.push({
                            type: 'MRI_METAL',
                            severity: 'WARNING',
                            message: '⚠️ MRI WARNING: Patient has metal implants',
                            recommendation: `Verify implant type is MRI-safe. Details: ${safetyData.metalImplantDetails || 'Not specified'}. May need radiologist approval.`
                        });
                    }
                }

                // Contrast Safety Checks
                if (test.withContrast || test.testName?.toLowerCase().includes('contrast')) {
                    if (safetyData?.hasContrastAllergy) {
                        checks.push({
                            type: 'CONTRAST_ALLERGY',
                            severity: 'BLOCKING',
                            message: `⛔ CONTRAST ALLERGY: Patient allergic to ${safetyData.contrastAllergyType || 'contrast media'}`,
                            recommendation: `Previous reaction: ${safetyData.contrastAllergyDetails || 'Not specified'}. Use alternative imaging or premedicate with steroids/antihistamines if absolutely necessary.`
                        });
                    }

                    // Renal function check for contrast
                    if (safetyData?.hasRenalImpairment) {
                        checks.push({
                            type: 'CONTRAST_RENAL',
                            severity: 'WARNING',
                            message: '⚠️ RENAL IMPAIRMENT: Risk of contrast-induced nephropathy',
                            recommendation: `eGFR: ${safetyData.lastEGFR || 'Unknown'}. Hydrate patient before/after. Consider alternative imaging if eGFR <30.`
                        });
                    } else if (!safetyData?.lastEGFR && !safetyData?.lastCreatinine) {
                        checks.push({
                            type: 'CONTRAST_NO_RENAL',
                            severity: 'INFO',
                            message: 'ℹ️ No recent renal function test',
                            recommendation: 'Consider ordering serum creatinine/eGFR before contrast study.'
                        });
                    }
                }

                // Pregnancy/Radiation Checks
                const radiationTests = ['X-Ray', 'CT', 'Fluoroscopy', 'Nuclear Medicine'];
                const isRadiation = radiationTests.some(rt => test.testName?.includes(rt) || test.testType === rt);

                if (isRadiation) {
                    if (safetyData?.isPregnant) {
                        checks.push({
                            type: 'RADIATION_PREGNANCY',
                            severity: 'BLOCKING',
                            message: '⛔ PREGNANT PATIENT: Radiation exposure risk to fetus',
                            recommendation: 'Avoid radiation if possible. Use ultrasound or MRI instead. If essential, use lead shielding and inform radiologist.'
                        });
                    }

                    // For women of childbearing age, verify pregnancy status
                    if (patientData?.gender === 'FEMALE') {
                        const age = patientData?.dateOfBirth ?
                            Math.floor((new Date().getTime() - new Date(patientData.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) :
                            null;

                        if (age && age >= 12 && age <= 55 && safetyData?.isPregnant === undefined) {
                            checks.push({
                                type: 'PREGNANCY_UNKNOWN',
                                severity: 'WARNING',
                                message: '⚠️ Pregnancy status unknown for woman of childbearing age',
                                recommendation: 'Verify pregnancy status before radiation exposure. Consider pregnancy test if LMP >4 weeks ago.'
                            });
                        }
                    }
                }
            });

            setSafetyChecks(checks);

            const hasBlockingIssues = checks.some(c => c.severity === 'BLOCKING' && !dismissed.has(c.type));
            onSafetyChange?.(!hasBlockingIssues);
        } catch (error) {
            console.error('Safety check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const dismissCheck = (checkType: string) => {
        setDismissed(new Set(dismissed).add(checkType));
        updateSafetyStatus();
    };

    const updateSafetyStatus = () => {
        const hasBlockingIssues = safetyChecks.some(c => c.severity === 'BLOCKING' && !dismissed.has(c.type));
        onSafetyChange?.(!hasBlockingIssues);
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'BLOCKING':
                return 'bg-red-100 border-red-500 text-red-900';
            case 'WARNING':
                return 'bg-orange-100 border-orange-500 text-orange-900';
            default:
                return 'bg-blue-100 border-blue-500 text-blue-900';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'BLOCKING':
                return <AlertTriangle className="w-5 h-5 text-red-600" />;
            case 'WARNING':
                return <Shield className="w-5 h-5 text-orange-600" />;
            default:
                return <CheckCircle className="w-5 h-5 text-blue-600" />;
        }
    };

    const activeChecks = safetyChecks.filter(c => !dismissed.has(c.type));

    if (activeChecks.length === 0 && !loading) {
        return null;
    }

    return (
        <div className="space-y-3">
            {loading && (
                <div className="text-center text-sm text-gray-600 py-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Checking investigation safety...</span>
                </div>
            )}

            {activeChecks.map((check) => (
                <div
                    key={check.type}
                    className={`border-l-4 p-4 rounded-lg ${getSeverityColor(check.severity)} flex items-start gap-3`}
                >
                    <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(check.severity)}</div>
                    <div className="flex-1">
                        <div className="font-bold text-sm mb-1">{check.message}</div>
                        <div className="text-sm mt-2 bg-white/40 px-2 py-1 rounded">
                            <strong>Recommendation:</strong> {check.recommendation}
                        </div>
                    </div>
                    {check.severity !== 'BLOCKING' && (
                        <button
                            onClick={() => dismissCheck(check.type)}
                            className="flex-shrink-0 p-1 hover:bg-white/30 rounded"
                            title="Acknowledge (Accept Risk)"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}

            {!patientSafety && selectedTests.length > 0 && (
                <div className="border-l-4 p-4 rounded-lg bg-yellow-100 border-yellow-500 text-yellow-900">
                    <div className="text-sm">
                        ⚠️ <strong>Safety screening not completed for this patient.</strong> Consider updating patient safety information before ordering high-risk investigations.
                    </div>
                </div>
            )}
        </div>
    );
}
