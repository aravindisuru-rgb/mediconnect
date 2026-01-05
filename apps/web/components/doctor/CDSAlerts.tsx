'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, X, Info, AlertCircle } from 'lucide-react';

interface InteractionAlert {
    severity: 'CONTRAINDICATED' | 'SERIOUS' | 'MONITOR' | 'MINOR';
    drug1: string;
    drug2: string;
    clinicalEffect: string;
    recommendation: string;
    mechanism?: string;
}

interface AllergyAlert {
    allergen: string;
    severity: string;
    reaction?: string;
    medication: string;
}

interface CDSAlertsProps {
    patientId: string;
    medications: Array<{ medicationName: string; genericName?: string }>;
    onAlertsChange?: (hasAlerts: boolean) => void;
}

export function CDSAlerts({ patientId, medications, onAlertsChange }: CDSAlertsProps) {
    const [interactionAlerts, setInteractionAlerts] = useState<InteractionAlert[]>([]);
    const [allergyAlerts, setAllergyAlerts] = useState<AllergyAlert[]>([]);
    const [duplicateWarnings, setDuplicateWarnings] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (medications.length === 0) {
            setInteractionAlerts([]);
            setAllergyAlerts([]);
            setDuplicateWarnings([]);
            onAlertsChange?.(false);
            return;
        }

        checkAllCDS();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [medications, patientId]);

    const checkAllCDS = async () => {
        setLoading(true);
        try {
            // Check drug interactions
            const interactionsRes = await fetch('/api/cds/check-interactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medications }),
            });
            const interactions = await interactionsRes.json();
            setInteractionAlerts(interactions || []);

            // Check allergies
            let allergyData: AllergyAlert[] = [];
            if (patientId) {
                const allergiesRes = await fetch('/api/cds/check-allergies', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ patientId, medications }),
                });
                allergyData = await allergiesRes.json();
                setAllergyAlerts(allergyData || []);
            }

            // Check duplicates      
            const duplicatesRes = await fetch('/api/cds/check-duplicates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medications }),
            });
            const duplicates = await duplicatesRes.json();
            setDuplicateWarnings(duplicates || []);

            const hasAlerts = interactions.length > 0 || allergyData.length > 0 || duplicates.length > 0;
            onAlertsChange?.(hasAlerts);
        } catch (error) {
            console.error('CDS check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const dismissAlert = (alertKey: string) => {
        setDismissed(new Set(dismissed).add(alertKey));
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'CONTRAINDICATED':
            case 'LIFE_THREATENING':
                return 'bg-red-100 border-red-500 text-red-900';
            case 'SERIOUS':
            case 'SEVERE':
                return 'bg-orange-100 border-orange-500 text-orange-900';
            case 'MONITOR':
            case 'MODERATE':
                return 'bg-yellow-100 border-yellow-500 text-yellow-900';
            default:
                return 'bg-blue-100 border-blue-500 text-blue-900';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'CONTRAINDICATED':
            case 'LIFE_THREATENING':
            case 'SERIOUS':
            case 'SEVERE':
                return <AlertTriangle className="w-5 h-5" />;
            case 'MONITOR':
            case 'MODERATE':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    const activeAllergyAlerts = allergyAlerts.filter(a => !dismissed.has(`allergy-${a.medication}-${a.allergen}`));
    const activeInteractionAlerts = interactionAlerts.filter(a => !dismissed.has(`interaction-${a.drug1}-${a.drug2}`));
    const activeDuplicateWarnings = duplicateWarnings.filter((w, i) => !dismissed.has(`duplicate-${i}`));

    const hasActiveAlerts = activeAllergyAlerts.length > 0 || activeInteractionAlerts.length > 0 || activeDuplicateWarnings.length > 0;

    if (!hasActiveAlerts && !loading) {
        return null;
    }

    return (
        <div className="space-y-3">
            {/* Allergy Alerts - Highest Priority */}
            {activeAllergyAlerts.map((alert) => {
                const key = `allergy-${alert.medication}-${alert.allergen}`;
                return (
                    <div
                        key={key}
                        className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)} flex items-start gap-3`}
                    >
                        <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(alert.severity)}</div>
                        <div className="flex-1">
                            <div className="font-bold text-sm mb-1">⚠️ ALLERGY ALERT: {alert.medication}</div>
                            <div className="text-sm">
                                <strong>Allergen:</strong> {alert.allergen}
                            </div>
                            <div className="text-sm">
                                <strong>Severity:</strong> {alert.severity}
                            </div>
                            {alert.reaction && (
                                <div className="text-sm">
                                    <strong>Previous Reaction:</strong> {alert.reaction}
                                </div>
                            )}
                            <div className="mt-2 text-xs font-semibold">
                                ⛔ DO NOT PRESCRIBE unless absolutely necessary and patient consents
                            </div>
                        </div>
                        <button
                            onClick={() => dismissAlert(key)}
                            className="flex-shrink-0 p-1 hover:bg-white/30 rounded"
                            title="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}

            {/* Drug Interaction Alerts */}
            {activeInteractionAlerts.map((alert) => {
                const key = `interaction-${alert.drug1}-${alert.drug2}`;
                return (
                    <div
                        key={key}
                        className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)} flex items-start gap-3`}
                    >
                        <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(alert.severity)}</div>
                        <div className="flex-1">
                            <div className="font-bold text-sm mb-1">
                                DRUG INTERACTION: {alert.drug1} ↔ {alert.drug2}
                            </div>
                            <div className="text-sm mb-1">
                                <strong>Severity:</strong> {alert.severity}
                            </div>
                            <div className="text-sm mb-1">
                                <strong>Effect:</strong> {alert.clinicalEffect}
                            </div>
                            {alert.mechanism && (
                                <div className="text-xs mb-1 opacity-80">
                                    <strong>Mechanism:</strong> {alert.mechanism}
                                </div>
                            )}
                            <div className="mt-2 text-sm font-semibold bg-white/40 px-2 py-1 rounded">
                                💡 {alert.recommendation}
                            </div>
                        </div>
                        <button
                            onClick={() => dismissAlert(key)}
                            className="flex-shrink-0 p-1 hover:bg-white/30 rounded"
                            title="Dismiss (Accept  Risk)"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}

            {/* Duplicate Therapy Warnings */}
            {activeDuplicateWarnings.map((warning, index) => {
                const key = `duplicate-${index}`;
                return (
                    <div
                        key={key}
                        className="border-l-4 p-4 rounded-lg bg-purple-100 border-purple-500 text-purple-900 flex items-start gap-3"
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            <Info className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-sm mb-1">Duplicate Therapy</div>
                            <div className="text-sm">{warning}</div>
                        </div>
                        <button
                            onClick={() => dismissAlert(key)}
                            className="flex-shrink-0 p-1 hover:bg-white/30 rounded"
                            title="Dismiss"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}

            {loading && (
                <div className="text-center text-sm text-gray-600 py-2">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                    <span className="ml-2">Checking for interactions and allergies...</span>
                </div>
            )}
        </div>
    );
}
