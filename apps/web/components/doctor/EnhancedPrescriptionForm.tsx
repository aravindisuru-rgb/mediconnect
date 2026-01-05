import { useState } from 'react';
import { Plus, Trash2, Save, Printer, Pill } from "lucide-react";
import { CDSAlerts } from './CDSAlerts';

interface PrescriptionItem {
    medicationName: string;
    dosageStrength: string;
    dosageUnit: string;
    dosageForm: string;
    routeOfAdmin: string;
    frequency: string;
    duration: string;
    durationUnit: string;
    instructions: string;
}

export function EnhancedPrescriptionForm({ patientId }: { patientId: string }) {
    const [items, setItems] = useState<PrescriptionItem[]>([{
        medicationName: '',
        dosageStrength: '',
        dosageUnit: 'mg',
        dosageForm: 'tablet',
        routeOfAdmin: 'ORAL',
        frequency: 'BID',
        duration: '7',
        durationUnit: 'days',
        instructions: ''
    }]);
    const [pharmacyNote, setPharmacyNote] = useState('');
    const [substitutionPermitted, setSubstitutionPermitted] = useState(true);
    const [refillsAuthorized, setRefillsAuthorized] = useState(0);

    // Dosage units
    const dosageUnits = ['mg', 'mcg', 'g', 'mL', 'units', 'IU'];

    // Dosage forms
    const dosageForms = ['tablet', 'capsule', 'syrup', 'suspension', 'injection', 'cream', 'ointment', 'drops', 'inhaler', 'patch'];

    // Route of administration
    const routes = [
        { value: 'ORAL', label: 'Oral (PO)' },
        { value: 'IV', label: 'Intravenous (IV)' },
        { value: 'IM', label: 'Intramuscular (IM)' },
        { value: 'SC', label: 'Subcutaneous (SC)' },
        { value: 'TOPICAL', label: 'Topical' },
        { value: 'INHALATION', label: 'Inhalation' },
        { value: 'RECTAL', label: 'Rectal' },
        { value: 'SUBLINGUAL', label: 'Sublingual' },
    ];

    // Frequency options
    const frequencies = [
        { value: 'QD', label: 'QD (Once daily)', help: 'Once daily' },
        { value: 'BID', label: 'BID (Twice daily)', help: '2 times/day' },
        { value: 'TID', label: 'TID (3x daily)', help: '3 times/day' },
        { value: 'QID', label: 'QID (4x daily)', help: '4 times/day' },
        { value: 'Q4H', label: 'Q4H', help: 'Every 4 hours' },
        { value: 'Q6H', label: 'Q6H', help: 'Every 6 hours' },
        { value: 'Q8H', label: 'Q8H', help: 'Every 8 hours' },
        { value: 'Q12H', label: 'Q12H', help: 'Every 12 hours' },
        { value: 'PRN', label: 'PRN', help: 'As needed' },
        { value: 'AC', label: 'AC', help: 'Before meals' },
        { value: 'PC', label: 'PC', help: 'After meals' },
        { value: 'HS', label: 'HS', help: 'At bedtime' },
    ];

    // Quick duration selectors
    const quickDurations = [
        { days: 3, label: '3 days' },
        { days: 5, label: '5 days' },
        { days: 7, label: '7 days' },
        { days: 10, label: '10 days' },
        { days: 14, label: '2 weeks' },
        { days: 21, label: '3 weeks' },
        { days: 30, label: '1 month' },
        { days: 90, label: '3 months' },
    ];

    const handleSubmit = async () => {
        const formattedItems = items.map(item => ({
            medicationName: item.medicationName,
            dosage: `${item.dosageStrength}${item.dosageUnit} ${item.dosageForm}`, // Composite for display
            dosageStrength: item.dosageStrength,
            dosageUnit: item.dosageUnit,
            dosageForm: item.dosageForm,
            routeOfAdmin: item.routeOfAdmin,
            frequency: item.frequency,
            duration: `${item.duration} ${item.durationUnit}`,
            instructions: item.instructions
        }));

        const res = await fetch('/api/prescriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                patientId,
                doctorId: 'doctor-id-placeholder', // TODO: Get from AuthContext
                items: formattedItems,
                pharmacyNote,
                substitutionPermitted,
                refillsAuthorized,
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            })
        });
        if (res.ok) {
            alert('✅ Prescription sent successfully');
            // Reset form
            setItems([{
                medicationName: '',
                dosageStrength: '',
                dosageUnit: 'mg',
                dosageForm: 'tablet',
                routeOfAdmin: 'ORAL',
                frequency: 'BID',
                duration: '7',
                durationUnit: 'days',
                instructions: ''
            }]);
        } else {
            alert('❌ Error sending prescription');
        }
    };

    const addItem = () => {
        setItems([...items, {
            medicationName: '',
            dosageStrength: '',
            dosageUnit: 'mg',
            dosageForm: 'tablet',
            routeOfAdmin: 'ORAL',
            frequency: 'BID',
            duration: '7',
            durationUnit: 'days',
            instructions: ''
        }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof PrescriptionItem, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const setQuickDuration = (index: number, days: number) => {
        const newItems = [...items];
        newItems[index].duration = days.toString();
        newItems[index].durationUnit = 'days';
        setItems(newItems);
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Pill className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-900">EU/USA Standard Prescription</h2>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50 text-sm font-medium">
                        <Printer className="w-4 h-4" /> Print Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                    >
                        <Save className="w-4 h-4" /> E-Sign & Send
                    </button>
                </div>
            </div>

            {/* CDS Alerts Section */}
            <div className="mb-6">
                <CDSAlerts
                    patientId={patientId}
                    medications={items.filter(item => item.medicationName.trim() !== '').map(item => ({
                        medicationName: item.medicationName,
                        genericName: undefined
                    }))}
                />
            </div>

            {/* Medication List */}
            <div className="space-y-6 mb-6">
                {items.map((item, index) => (
                    <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mt-1">
                                {index + 1}
                            </span>

                            <div className="flex-1 space-y-4">
                                {/* Medication Name */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">MEDICATION NAME *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Amoxicillin"
                                        className="w-full p-2.5 border border-slate-300 rounded text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={item.medicationName}
                                        onChange={(e) => updateItem(index, 'medicationName', e.target.value)}
                                    />
                                </div>

                                {/* Dosage Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">STRENGTH *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 500"
                                            className="w-full p-2.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={item.dosageStrength}
                                            onChange={(e) => updateItem(index, 'dosageStrength', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">UNIT *</label>
                                        <select
                                            className="w-full p-2.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={item.dosageUnit}
                                            onChange={(e) => updateItem(index, 'dosageUnit', e.target.value)}
                                        >
                                            {dosageUnits.map(unit => (
                                                <option key={unit} value={unit}>{unit}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">FORM *</label>
                                        <select
                                            className="w-full p-2.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={item.dosageForm}
                                            onChange={(e) => updateItem(index, 'dosageForm', e.target.value)}
                                        >
                                            {dosageForms.map(form => (
                                                <option key={form} value={form}>{form.charAt(0).toUpperCase() + form.slice(1)}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Route of Administration */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">ROUTE OF ADMINISTRATION *</label>
                                    <select
                                        className="w-full p-2.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={item.routeOfAdmin}
                                        onChange={(e) => updateItem(index, 'routeOfAdmin', e.target.value)}
                                    >
                                        {routes.map(route => (
                                            <option key={route.value} value={route.value}>{route.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Frequency Selector */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">FREQUENCY *</label>
                                    <div className="flex flex-wrap gap-2">
                                        {frequencies.map(freq => (
                                            <button
                                                key={freq.value}
                                                type="button"
                                                title={freq.help}
                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${item.frequency === freq.value
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'bg-white border border-slate-300 text-slate-700 hover:border-blue-400'
                                                    }`}
                                                onClick={() => updateItem(index, 'frequency', freq.value)}
                                            >
                                                {freq.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Duration Quick Selectors */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-2">DURATION *</label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {quickDurations.map(qd => (
                                            <button
                                                key={qd.days}
                                                type="button"
                                                className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${item.duration === qd.days.toString() && item.durationUnit === 'days'
                                                    ? 'bg-emerald-600 text-white shadow-md'
                                                    : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-400'
                                                    }`}
                                                onClick={() => setQuickDuration(index, qd.days)}
                                            >
                                                {qd.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <span className="text-xs text-slate-500">Custom:</span>
                                        <input
                                            type="number"
                                            min="1"
                                            placeholder="7"
                                            className="w-20 p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                            value={item.duration}
                                            onChange={(e) => updateItem(index, 'duration', e.target.value)}
                                        />
                                        <select
                                            className="p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                                            value={item.durationUnit}
                                            onChange={(e) => updateItem(index, 'durationUnit', e.target.value)}
                                        >
                                            <option value="days">days</option>
                                            <option value="weeks">weeks</option>
                                            <option value="months">months</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">SPECIAL INSTRUCTIONS</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Take with food, Avoid alcohol"
                                        className="w-full p-2.5 border border-slate-300 rounded text-sm italic text-slate-600 focus:ring-2 focus:ring-blue-500"
                                        value={item.instructions}
                                        onChange={(e) => updateItem(index, 'instructions', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Remove Button */}
                            {items.length > 1 && (
                                <button
                                    onClick={() => removeItem(index)}
                                    className="flex-shrink-0 text-red-500 p-2 hover:bg-red-50 rounded transition-colors"
                                    title="Remove medication"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <button
                    onClick={addItem}
                    className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700"
                >
                    <Plus className="w-5 h-5" /> Add Another Medication
                </button>
            </div>

            {/* EU Specific Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Note to Pharmacist</label>
                    <textarea
                        className="w-full p-3 border border-slate-300 rounded h-24 text-sm focus:ring-2 focus:ring-blue-500"
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
                            className="w-16 p-2 border border-purple-200 rounded text-center font-bold text-purple-900 focus:ring-2 focus:ring-purple-500"
                            placeholder="0"
                            value={refillsAuthorized}
                            onChange={(e) => setRefillsAuthorized(parseInt(e.target.value) || 0)}
                        />
                    </div>

                    <div className="flex items-center gap-2 p-2 justify-center">
                        <div className="w-full h-px bg-slate-300"></div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">EU/USA Standards Compliant</span>
                        <div className="w-full h-px bg-slate-300"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
