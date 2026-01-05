"use client";
import { useState, useEffect } from 'react';
import { DollarSign, FileText, Clock } from "lucide-react";

interface Invoice {
    id: string;
    status: string;
    createdAt: string;
    totalAmount: number;
    patient?: {
        firstName: string;
        lastName: string;
    };
}

export default function PharmacyBillingPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch('/api/billing/pharmacy');
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Billing & Invoices</h1>
                    <p className="text-slate-500">Track payments and financial records</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-500">Unpaid Invoices</p>
                        <Clock className="w-4 h-4 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        {invoices.filter(i => i.status === 'UNPAID').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-500">Total revenue (This Month)</p>
                        <DollarSign className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                        LKR {invoices.reduce((acc, curr) => acc + Number(curr.totalAmount), 0).toLocaleString()}
                    </p>
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
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            Mark as Paid
                                        </button>
                                    ) : (
                                        <button className="text-slate-400">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {invoices.length === 0 && !loading && (
                    <div className="p-10 text-center text-slate-500">No invoices found.</div>
                )}
            </div>
        </div>
    );
}
