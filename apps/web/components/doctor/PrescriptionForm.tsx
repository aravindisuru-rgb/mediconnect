import React, { useState } from 'react';
import { Plus, Trash2, Save, Printer } from "lucide-react";

export function PrescriptionForm({ patientId }: { patientId: string }) {
    const [items, setItems] = useState([{ medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    const [pharmacyNote, setPharmacyNote] = useState('');
    const [substitutionPermitted, setSubstitutionPermitted] = useState(true);
    const [refillsAuthorized, setRefillsAuthorized] = useState(0);

    const handleSubmit = async () => {
        const res = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId,
                doctorId: 'doctor-id-placeholder', // In real app, get from AuthContext
                items,
                pharmacyNote,
                substitutionPermitted,
                refillsAuthorized,
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            })
        });
        if (res.ok) alert('Prescription sent successfully');
        else alert('Error sending prescription');
    };

    const addItem = () => {
        setItems([...items, { medicationName: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: string) => {
        const newItems = [...items];
        // @ts-ignore
        newItems[index][field] = value;
        setItems(newItems);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 border-b-2 border-slate-900 pb-1">EU Standard Prescription</h2>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-sm font-medium">
                        <Printer className="w-4 h-4" /> Print Draft
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium">
                        <Save className="w-4 h-4" /> E-Sign & Send
                    </button>
                </div>
            </div>

            {/* Medication List */}
            <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-400 mt-2">{index + 1}.</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    placeholder="Medication (e.g. Amoxicillin)"
                                    className="w-full p-2 border border-slate-300 rounded text-sm font-medium"
                                    value={item.medicationName}
                                    onChange={(e) => updateItem(index, 'medicationName', e.target.value)}
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Dosage (e.g. 500mg)"
                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                value={item.dosage}
                                onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Freq (e.g. TID)"
                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                value={item.frequency}
                                onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Duration (e.g. 7 days)"
                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                value={item.duration}
                                onChange={(e) => updateItem(index, 'duration', e.target.value)}
                            />
                            <div className="lg:col-span-5">
                                <input
                                    type="text"
                                    placeholder="Special Instructions (e.g. Take with food)"
                                    className="w-full p-2 border border-slate-300 rounded text-sm italic text-slate-600"
                                    value={item.instructions}
                                    onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                />
                            </div>
                        </div>
                        {items.length > 1 && (
                            <button onClick={() => removeItem(index)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={addItem} className="flex items-center gap-1 text-blue-600 font-medium text-sm hover:underline">
                    <Plus className="w-4 h-4" /> Add Medication
                </button>
            </div>

            {/* EU Specific Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Note to Pharmacist</label>
                    <textarea
                        className="w-full p-2 border border-slate-300 rounded h-20 text-sm"
                        placeholder="Private note to dispensing pharmacist..."
                        value={pharmacyNote}
                        onChange={(e) => setPharmacyNote(e.target.value)}
                    />
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                        <div>
                            <span className="block text-sm font-bold text-blue-900">Generic Substitution</span>
                            <span className="text-xs text-blue-700">Permit pharmacy to substitute with generic equivalent</span>
                        </div>
                        <input
                            type="checkbox"
                            checked={substitutionPermitted}
                            onChange={(e) => setSubstitutionPermitted(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-lg">
                        <div>
                            <span className="block text-sm font-bold text-purple-900">Authorized Refills</span>
                            <span className="text-xs text-purple-700">For chronic illness management</span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            max="12"
                            className="w-16 p-2 border border-purple-200 rounded text-center font-bold text-purple-900"
                            placeholder="0"
                            value={refillsAuthorized}
                            onChange={(e) => setRefillsAuthorized(parseInt(e.target.value) || 0)}
                        />
                    </div>

                    <div className="flex items-center gap-2 p-2 justify-center">
                        <div className="w-full h-px bg-slate-300"></div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">EU Regulation Compliance</span>
                        <div className="w-full h-px bg-slate-300"></div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2"
                >
                    <Save className="w-4 h-4" /> Send & Authorize
                </button>
            </div>
        </div>
    );
}
