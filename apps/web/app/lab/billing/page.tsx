"use client";
import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Clock, CheckCircle, FileText, DollarSign } from "lucide-react";

export default function LabBillingPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const tests = [
        { code: 'LIPID', name: 'Lipid Profile', price: '2,500', turnaround: '24h' },
        { code: 'FBC', name: 'Full Blood Count', price: '850', turnaround: '6h' },
        { code: 'FBS', name: 'Fasting Blood Sugar', price: '600', turnaround: '4h' },
        { code: 'TSH', name: 'Thyroid Estimulating Hormone', price: '1,800', turnaround: '24h' },
    ];

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch('/api/billing/lab');
                const data = await res.json();
                setInvoices(data);
            } catch (e) {
                console.error("Error fetching invoices", e);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const markAsPaid = async (id: string) => {
        const res = await fetch(`/api/billing/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'PAID' })
        });
        if (res.ok) {
            setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'PAID' } : inv));
        }
    };

    return (
        <div className="space-y-10">
            {/* Catalog Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Test Pricing & Catalog</h1>
                        <p className="text-slate-500">Manage standard rates and billing codes</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-900">Test Code</th>
                                <th className="px-6 py-4 font-semibold text-slate-900">Description</th>
                                <th className="px-6 py-4 font-semibold text-slate-900">Price (LKR)</th>
                                <th className="px-6 py-4 font-semibold text-slate-900">Turnaround</th>
                                <th className="px-6 py-4 font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {tests.map((test) => (
                                <tr key={test.code} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-600">{test.code}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{test.name}</td>
                                    <td className="px-6 py-4 font-medium text-emerald-600">LKR {test.price}</td>
                                    <td className="px-6 py-4 text-slate-500">{test.turnaround}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-slate-400 hover:text-purple-600">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invoices Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Recent Lab Invoices</h2>
                        <p className="text-slate-500">Track test payments and outstanding balances</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Invoice ID</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Patient</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Date</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Amount</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-sm">INV-{inv.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium">{inv.patient?.firstName} {inv.patient?.lastName}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(inv.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        LKR {Number(inv.totalAmount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {inv.status === 'UNPAID' ? (
                                            <button
                                                onClick={() => markAsPaid(inv.id)}
                                                className="text-sm font-medium text-purple-600 hover:text-purple-700"
                                            >
                                                Mark as Paid
                                            </button>
                                        ) : (
                                            <FileText className="w-4 h-4 text-slate-400" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {invoices.length === 0 && !loading && (
                        <div className="p-10 text-center text-slate-500 italic">No invoices generated yet.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
