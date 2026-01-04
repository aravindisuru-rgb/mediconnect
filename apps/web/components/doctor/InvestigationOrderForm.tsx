'use client';

import React, { useState } from 'react';
import { FileText, Send, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { InvestigationSafetyChecker } from './InvestigationSafetyChecker';
import { OrderSetSelector } from './OrderSetSelector';

interface RadiologicalTest {
    testType: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound' | 'Mammography';
    bodyPart?: string;
    views?: string[];
    laterality?: 'Left' | 'Right' | 'Bilateral';
    withContrast?: boolean;
}

interface BiochemicalTest {
    panel: string;
    tests: string[];
}

interface InvestigationOrderItem {
    category: string;
    selected: boolean;
    details: RadiologicalTest | BiochemicalTest | any;
}

export function InvestigationOrderForm({ patientId, doctorId }: { patientId: string; doctorId?: string }) {
    const [activeCategory, setActiveCategory] = useState<string | null>('RADIOLOGICAL');
    const [selectedTests, setSelectedTests] = useState<any[]>([]);
    const [clinicalIndication, setClinicalIndication] = useState('');
    const [priority, setPriority] = useState('ROUTINE');
    const [specialInstructions, setSpecialInstructions] = useState('');

    // Radiological catalog
    const radiologyTests = {
        'X-Ray': {
            bodyParts: ['Chest', 'Abdomen', 'Skull', 'Cervical Spine', 'Thoracic Spine', 'Lumbar Spine',
                'Pelvis', 'Shoulder', 'Elbow', 'Wrist', 'Hand', 'Hip', 'Knee', 'Ankle', 'Foot'],
            views: ['AP', 'PA', 'Lateral', 'Oblique', 'Flexion', 'Extension']
        },
        'CT Scan': ['Brain', 'Chest', 'Abdomen & Pelvis', 'Spine', 'Extremities', 'Angiography'],
        'MRI': ['Brain', 'Spine', 'Joint (Knee/Shoulder/etc.)', 'Abdomen', 'Angiography'],
        'Ultrasound': ['Abdomen Complete', 'Pelvis', 'Obstetric', 'Breast', 'Thyroid', 'Musculoskeletal', 'Vascular Doppler'],
        'Mammography': ['Screening Bilateral', 'Diagnostic', 'Tomosynthesis 3D']
    };

    // Biochemical panels
    const biochemicalTests = {
        'Lipid Panel': ['Total Cholesterol', 'LDL', 'HDL', 'Triglycerides', 'VLDL'],
        'Liver Function Tests': ['AST', 'ALT', 'ALP', 'Total Bilirubin', 'Direct Bilirubin', 'Albumin', 'GGT'],
        'Kidney Function Tests': ['Creatinine', 'BUN', 'eGFR', 'Uric Acid', 'Electrolytes (Na, K, Cl)'],
        'Thyroid Panel': ['TSH', 'Free T4', 'Free T3', 'Anti-TPO'],
        'Glucose Tests': ['Fasting Blood Sugar', 'HbA1c', 'OGTT', 'Random Blood Sugar'],
        'Cardiac Markers': ['Troponin I/T', 'CK-MB', 'BNP', 'D-Dimer']
    };

    // Hematological tests
    const hematologicalTests = {
        'Complete Blood Count (CBC)': ['WBC', 'RBC', 'Hemoglobin', 'Hematocrit', 'Platelets', 'Differential Count'],
        'Coagulation Studies': ['PT/INR', 'aPTT', 'Fibrinogen', 'Bleeding Time', 'Clotting Time'],
        'Blood Typing': ['ABO Group', 'Rh Factor', 'Crossmatch'],
        'Inflammatory Markers': ['ESR', 'CRP', 'Procalcitonin']
    };

    // Microbiological tests
    const microbiologicalTests = {
        'Culture & Sensitivity': {
            specimens: ['Urine', 'Blood', 'Sputum', 'Wound', 'Throat', 'Stool', 'CSF']
        },
        'Staining': ['Gram Stain', 'AFB Stain (TB)'],
        'Viral Tests': ['HIV', 'Hepatitis B/C', 'COVID-19', 'Dengue'],
        'Serology': ['Widal Test', 'VDRL', 'Toxoplasma', 'Rubella']
    };

    const [xrayForm, setXrayForm] = useState({
        bodyPart: '',
        views: [] as string[],
        laterality: 'Bilateral',
        portable: false
    });

    const addTest = (category: string, testName: string, details: any = {}) => {
        setSelectedTests([...selectedTests, { category, testName, details }]);
    };

    const removeTest = (index: number) => {
        setSelectedTests(selectedTests.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (selectedTests.length === 0) {
            alert('Please select at least one investigation');
            return;
        }
        if (!clinicalIndication.trim()) {
            alert('Clinical indication is required');
            return;
        }

        const res = await fetch('/api/investigations/with-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId,
                doctorId: doctorId || 'doctor-id-placeholder',
                items: selectedTests,
                clinicalIndication,
                priority,
                specialInstructions,
                fastingRequired: selectedTests.some(t =>
                    t.testName.includes('Lipid') || t.testName.includes('Fasting')
                )
            })
        });

        if (res.ok) {
            alert('✅ Investigation order submitted successfully');
            setSelectedTests([]);
            setClinicalIndication('');
            setSpecialInstructions('');
        } else {
            alert('❌ Error submitting investigation order');
        }
    };

    const CategorySection = ({ title, icon, isOpen, onClick, children }: any) => (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <button
                onClick={onClick}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-bold text-slate-900">{title}</span>
                </div>
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            {isOpen && <div className="p-4 border-t border-slate-200 bg-slate-50">{children}</div>}
        </div>
    );

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-slate-900">Order Investigations</h2>
                </div>
                <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
                >
                    <Send className="w-4 h-4" /> Submit Order
                </button>
            </div>

            {/* Order Sets Quick Selector */}
            <div className="mb-6">
                <OrderSetSelector
                    onSelect={(tests) => {
                        // Add all tests from order set
                        const newTests = tests.map(test => ({
                            category: test.category,
                            testName: test.testName,
                            details: { testCode: test.testCode }
                        }));
                        setSelectedTests([...selectedTests, ...newTests]);
                    }}
                />
            </div>

            {/* Safety Checks */}
            <div className="mb-6">
                <InvestigationSafetyChecker
                    patientId={patientId}
                    selectedTests={selectedTests.map(t => ({
                        category: t.category,
                        testName: t.testName,
                        withContrast: t.details?.withContrast,
                        testType: t.details?.testType
                    }))}
                />
            </div>

            {/* Selected Tests Summary */}
            {selectedTests.length > 0 && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-bold text-purple-900 mb-2">Selected Tests ({selectedTests.length})</h3>
                    <div className="space-y-1">
                        {selectedTests.map((test, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className="text-purple-800">
                                    {test.category}: {test.testName}
                                    {test.details.bodyPart && ` - ${test.details.bodyPart}`}
                                    {test.details.views && ` (${test.details.views.join(', ')})`}
                                </span>
                                <button
                                    onClick={() => removeTest(idx)}
                                    className="text-red-600 hover:text-red-800 text-xs font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Category Sections */}
            <div className="space-y-3 mb-6">
                {/* RADIOLOGICAL */}
                <CategorySection
                    title="Radiological"
                    icon="🩻"
                    isOpen={activeCategory === 'RADIOLOGICAL'}
                    onClick={() => setActiveCategory(activeCategory === 'RADIOLOGICAL' ? null : 'RADIOLOGICAL')}
                >
                    <div className="space-y-4">
                        {/* X-Ray Section */}
                        <div className="bg-white p-4 rounded border border-slate-200">
                            <h4 className="font-bold text-slate-900 mb-3">X-Ray</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">BODY PART</label>
                                    <select
                                        className="w-full p-2 border border-slate-300 rounded text-sm"
                                        value={xrayForm.bodyPart}
                                        onChange={(e) => setXrayForm({ ...xrayForm, bodyPart: e.target.value })}
                                    >
                                        <option value="">Select body part...</option>
                                        {radiologyTests['X-Ray'].bodyParts.map(part => (
                                            <option key={part} value={part}>{part}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">LATERALITY</label>
                                    <select
                                        className="w-full p-2 border border-slate-300 rounded text-sm"
                                        value={xrayForm.laterality}
                                        onChange={(e) => setXrayForm({ ...xrayForm, laterality: e.target.value as any })}
                                    >
                                        <option value="Bilateral">Bilateral</option>
                                        <option value="Left">Left</option>
                                        <option value="Right">Right</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-3">
                                <label className="block text-xs font-semibold text-slate-700 mb-2">VIEWS (select all that apply)</label>
                                <div className="flex flex-wrap gap-2">
                                    {radiologyTests['X-Ray'].views.map(view => (
                                        <button
                                            key={view}
                                            type="button"
                                            className={`px-3 py-1 rounded text-sm font-medium ${xrayForm.views.includes(view)
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-white border border-slate-300 text-slate-700'
                                                }`}
                                            onClick={() => {
                                                setXrayForm({
                                                    ...xrayForm,
                                                    views: xrayForm.views.includes(view)
                                                        ? xrayForm.views.filter(v => v !== view)
                                                        : [...xrayForm.views, view]
                                                });
                                            }}
                                        >
                                            {view}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (xrayForm.bodyPart && xrayForm.views.length > 0) {
                                        addTest('RADIOLOGICAL', `X-Ray ${xrayForm.bodyPart}`, {
                                            testType: 'X-Ray',
                                            bodyPart: xrayForm.bodyPart,
                                            views: xrayForm.views,
                                            laterality: xrayForm.laterality
                                        });
                                        setXrayForm({ bodyPart: '', views: [], laterality: 'Bilateral', portable: false });
                                    } else {
                                        alert('Please select body part and at least one view');
                                    }
                                }}
                                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700"
                            >
                                + Add X-Ray
                            </button>
                        </div>

                        {/* Other Radiology Tests */}
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(radiologyTests).filter(([key]) => key !== 'X-Ray').map(([testType, options]) => (
                                <div key={testType} className="bg-white p-3 border border-slate-200 rounded">
                                    <h5 className="font-semibold text-sm text-slate-900 mb-2">{testType}</h5>
                                    {Array.isArray(options) ? (
                                        <div className="space-y-1">
                                            {options.map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => addTest('RADIOLOGICAL', `${testType}: ${option}`, { testType, subType: option })}
                                                    className="block w-full text-left px-2 py-1 text-xs hover:bg-purple-50 rounded"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </CategorySection>

                {/* BIOCHEMICAL */}
                <CategorySection
                    title="Biochemical"
                    icon="🧪"
                    isOpen={activeCategory === 'BIOCHEMICAL'}
                    onClick={() => setActiveCategory(activeCategory === 'BIOCHEMICAL' ? null : 'BIOCHEMICAL')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(biochemicalTests).map(([panel, tests]) => (
                            <div key={panel} className="bg-white p-3 border border-slate-200 rounded">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-semibold text-sm text-slate-900">{panel}</h5>
                                    <button
                                        onClick={() => addTest('BIOCHEMICAL', panel, { panel, tests })}
                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                    >
                                        + Add Panel
                                    </button>
                                </div>
                                <div className="text-xs text-slate-600 space-y-0.5">
                                    {tests.map(test => (
                                        <div key={test}>• {test}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CategorySection>

                {/* HEMATOLOGICAL */}
                <CategorySection
                    title="Hematological"
                    icon="🔬"
                    isOpen={activeCategory === 'HEMATOLOGICAL'}
                    onClick={() => setActiveCategory(activeCategory === 'HEMATOLOGICAL' ? null : 'HEMATOLOGICAL')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(hematologicalTests).map(([panel, tests]) => (
                            <div key={panel} className="bg-white p-3 border border-slate-200 rounded">
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-semibold text-sm text-slate-900">{panel}</h5>
                                    <button
                                        onClick={() => addTest('HEMATOLOGICAL', panel, { panel, tests })}
                                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                    >
                                        + Add Test
                                    </button>
                                </div>
                                <div className="text-xs text-slate-600 space-y-0.5">
                                    {tests.map(test => (
                                        <div key={test}>• {test}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CategorySection>

                {/* MICROBIOLOGICAL */}
                <CategorySection
                    title="Microbiological"
                    icon="🦠"
                    isOpen={activeCategory === 'MICROBIOLOGICAL'}
                    onClick={() => setActiveCategory(activeCategory === 'MICROBIOLOGICAL' ? null : 'MICROBIOLOGICAL')}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(microbiologicalTests).map(([testName, details]) => (
                            <div key={testName} className="bg-white p-3 border border-slate-200 rounded">
                                <h5 className="font-semibold text-sm text-slate-900 mb-2">{testName}</h5>
                                {typeof details === 'object' && 'specimens' in details ? (
                                    <div className="space-y-1">
                                        {details.specimens.map((specimen: string) => (
                                            <button
                                                key={specimen}
                                                onClick={() => addTest('MICROBIOLOGICAL', `${testName} - ${specimen}`, { testName, specimen })}
                                                className="block w-full text-left px-2 py-1 text-xs hover:bg-green-50 rounded"
                                            >
                                                {specimen}
                                            </button>
                                        ))}
                                    </div>
                                ) : Array.isArray(details) ? (
                                    <div className="space-y-1">
                                        {details.map(item => (
                                            <button
                                                key={item}
                                                onClick={() => addTest('MICROBIOLOGICAL', `${testName}: ${item}`, { testName, subType: item })}
                                                className="block w-full text-left px-2 py-1 text-xs hover:bg-green-50 rounded"
                                            >
                                                {item}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => addTest('MICROBIOLOGICAL', testName, { testName })}
                                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </CategorySection>
            </div>

            {/* Clinical Indication & Priority */}
            <div className="space-y-4 border-t border-slate-200 pt-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        CLINICAL INDICATION * (Required)
                    </label>
                    <textarea
                        className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
                        placeholder="e.g., Persistent cough for 2 weeks, rule out pneumonia..."
                        rows={3}
                        value={clinicalIndication}
                        onChange={(e) => setClinicalIndication(e.target.value)}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">PRIORITY</label>
                        <div className="flex gap-2">
                            {['ROUTINE', 'URGENT', 'STAT'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`flex-1 px-3 py-2 rounded font-medium text-sm ${priority === p
                                        ? p === 'STAT' ? 'bg-red-600 text-white' : p === 'URGENT' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                                        : 'bg-white border border-slate-300 text-slate-700'
                                        }`}
                                    onClick={() => setPriority(p)}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-2">SPECIAL INSTRUCTIONS</label>
                        <input
                            type="text"
                            placeholder="e.g., Fasting required, Portable, etc."
                            className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-purple-500 text-sm"
                            value={specialInstructions}
                            onChange={(e) => setSpecialInstructions(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
