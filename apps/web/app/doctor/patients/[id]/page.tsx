import { DiagnosisCard } from '../../../../components/doctor/DiagnosisCard';
import { ReferralSystem } from '../../../../components/doctor/ReferralSystem';
import { PatientVitalsMonitor } from '../../../../components/doctor/vitals/PatientVitalsMonitor';
import { ArrowLeft, Plus, FileText, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PatientDetailPage() {
    const { id } = useParams();
    const [patient, setPatient] = useState<any>(null);
    const [vitals, setVitals] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const [pRes, vRes] = await Promise.all([
                    fetch(`/api/patients/${id}`),
                    fetch(`/api/vitals/patient/${id}/latest`)
                ]);
                const pData = await pRes.json();
                const vData = await vRes.json();
                setPatient(pData);
                setVitals(vData);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientData();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Loading clinical records...</div>;
    if (!patient) return <div className="p-10 text-center">Patient not found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/doctor/patients" className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{patient.firstName} {patient.lastName}</h1>
                    <p className="text-slate-500">{patient.gender} • {patient.age} Yrs • ID: #{patient.id.slice(0, 8)}</p>
                </div>
            </div>

            {/* Vitals Ribbon */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Latest Patient-Recorded Vitals
                </h2>
                <PatientVitalsMonitor vitals={vitals} />
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex space-x-8">
                    {['Overview', 'Clinical Notes', 'Diagnoses', 'Referrals', 'History'].map(tab => (
                        <button
                            key={tab}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.toLowerCase().split(' ')[0]
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Clinical Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Diagnosis Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Active Diagnoses
                            </h2>
                            <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Add
                            </button>
                        </div>

                        <DiagnosisCard
                            type="DEFINITIVE"
                            title="Type 2 Diabetes Mellitus"
                            date="2024-11-10"
                            notes="Patient responsive to Metformin. HbA1c stable at 6.8%."
                            onUpdate={() => { }}
                        />
                        <DiagnosisCard
                            type="WORKING"
                            title="Mild Hypertension"
                            date="2025-12-28"
                            notes="Patient reports occasional headaches. Monitoring BP for 2 weeks before diagnosis."
                            onUpdate={() => { }}
                        />
                    </section>

                    {/* Clinical Notes / SOAP */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-slate-600" />
                            New Consultation Note
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subjective</label>
                                <textarea className="w-full p-2 border border-slate-300 rounded h-20 text-sm" placeholder="Patient complaints..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Objective</label>
                                <textarea className="w-full p-2 border border-slate-300 rounded h-20 text-sm" placeholder="Vitals, observations..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assessment</label>
                                <textarea className="w-full p-2 border border-slate-300 rounded h-20 text-sm" placeholder="Analysis..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Plan</label>
                                <textarea className="w-full p-2 border border-slate-300 rounded h-20 text-sm" placeholder="Treatment plan..." />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200">Save Draft</button>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">Finalize Note</button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <ReferralSystem />

                    {/* Rapid Actions */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 text-sm font-medium text-blue-800 transition-colors">
                                Order Standard Labs (EU)
                            </button>
                            <button className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 text-sm font-medium text-blue-800 transition-colors">
                                Prescribe Medication
                            </button>
                            <button className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 text-sm font-medium text-blue-800 transition-colors">
                                Generate Medical Certificate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
