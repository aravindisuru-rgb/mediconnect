"use client";
import { useState, useEffect } from 'react';
import { Send, Calendar, AlertCircle } from "lucide-react";

interface Referral {
    id: string;
    priority: string;
    status: string;
    clinicalNotes: string;
    specialistReport?: string;
    feedbackDate?: string;
    createdAt: string;
    patient?: {
        firstName: string;
        lastName: string;
    };
    fromDoctor?: {
        lastName: string;
    };
}

export default function SpecialistReferralsPage() {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
    const [report, setReport] = useState('');

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const res = await fetch('/api/referrals/received');
                const data = await res.json();
                setReferrals(data);
            } catch (e) {
                console.error("Error fetching referrals", e);
            } finally {
                setLoading(false);
            }
        };
        fetchReferrals();
    }, []);

    const submitFeedback = async (id: string) => {
        const res = await fetch(`/api/referrals/${id}/feedback`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'COMPLETED', report })
        });
        if (res.ok) {
            alert("Feedback report submitted successfully");
            setReferrals(referrals.map(r => r.id === id ? { ...r, status: 'COMPLETED', specialistReport: report } : r));
            setSelectedReferral(null);
            setReport('');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Incoming Referrals</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-4">
                    {referrals.map(ref => (
                        <div
                            key={ref.id}
                            onClick={() => setSelectedReferral(ref)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedReferral?.id === ref.id
                                ? 'bg-blue-50 border-blue-200 shadow-md'
                                : 'bg-white border-slate-200 hover:border-blue-300'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <p className="font-bold text-slate-900">{ref.patient?.firstName} {ref.patient?.lastName}</p>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ref.priority === 'EMERGENCY' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                    {ref.priority}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mb-2">From: Dr. {ref.fromDoctor?.lastName}</p>
                            <div className="flex items-center text-xs text-slate-400">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(ref.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {referrals.length === 0 && !loading && (
                        <p className="text-slate-500 italic p-4">No incoming referrals found.</p>
                    )}
                </div>

                <div className="lg:col-span-2">
                    {selectedReferral ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-bold text-slate-900">Referral Details</h2>
                                <p className="text-sm text-slate-500">Case ID: {selectedReferral.id}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-2">Clinical Notes from GP</h3>
                                <div className="p-4 bg-slate-50 rounded-lg text-slate-700 leading-relaxed italic">
                                    &ldquo;{selectedReferral.clinicalNotes}&rdquo;
                                </div>
                            </div>

                            {selectedReferral.status !== 'COMPLETED' ? (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-900">Submit Specialist Report</h3>
                                    <textarea
                                        value={report}
                                        onChange={(e) => setReport(e.target.value)}
                                        placeholder="Enter your clinical findings, diagnosis, and recommended treatment plan..."
                                        className="w-full h-48 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button
                                        onClick={() => submitFeedback(selectedReferral.id)}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
                                    >
                                        <Send className="w-4 h-4" /> Send Feedback to GP
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-900 mb-2">Your Report</h3>
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-900 leading-relaxed font-medium">
                                        {selectedReferral.specialistReport}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">Submitted on {selectedReferral.feedbackDate ? new Date(selectedReferral.feedbackDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
                            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium text-center">Select a referral to view details and submit report</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
