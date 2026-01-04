import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

type DiagnosisType = 'WORKING' | 'DIFFERENTIAL' | 'DEFINITIVE';

interface DiagnosisCardProps {
    type: DiagnosisType;
    title: string;
    notes: string;
    date: string;
    onUpdate: (status: DiagnosisType) => void;
}

export function DiagnosisCard({ type, title, notes, date, onUpdate }: DiagnosisCardProps) {
    const [expanded, setExpanded] = useState(false);

    const colors = {
        WORKING: "bg-yellow-50 border-yellow-200 text-yellow-800",
        DIFFERENTIAL: "bg-purple-50 border-purple-200 text-purple-800",
        DEFINITIVE: "bg-green-50 border-green-200 text-green-800"
    };

    const icons = {
        WORKING: <HelpCircle className="w-5 h-5 text-yellow-600" />,
        DIFFERENTIAL: <AlertCircle className="w-5 h-5 text-purple-600" />,
        DEFINITIVE: <CheckCircle className="w-5 h-5 text-green-600" />
    };

    return (
        <div className={`border rounded-lg p-4 mb-3 transition-all ${colors[type]} ${expanded ? 'shadow-md' : ''}`}>
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
                <div className="flex items-center gap-3">
                    {icons[type]}
                    <div>
                        <h3 className="font-semibold text-lg">{title}</h3>
                        <p className="text-xs opacity-70">{type} DIAGNOSIS • {date}</p>
                    </div>
                </div>
                {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-black/10">
                    <p className="text-sm mb-4 whitespace-pre-wrap">{notes}</p>

                    <div className="flex gap-2 justify-end">
                        {type !== 'DEFINITIVE' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onUpdate('DEFINITIVE'); }}
                                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                                Confirm as Definitive
                            </button>
                        )}
                        {type === 'WORKING' && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onUpdate('DIFFERENTIAL'); }}
                                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                            >
                                Move to Differential
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
