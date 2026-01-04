import { Activity, DollarSign, Users, Clock } from "lucide-react";

import { useState, useEffect } from 'react';

export default function LabDashboard() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/investigations/lab/incoming');
                const data = await res.json();
                setOrders(data);
            } catch (e) {
                console.error("Error fetching orders", e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        const res = await fetch(`/api/investigations/${id}/status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            alert(`Order marked as ${status}`);
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
        }
    };

    const stats = [
        { title: "Pending Orders", value: "24", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
        { title: "Tests Completed", value: "156", icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Revenue (Today)", value: "LKR 45k", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
        { title: "Active Patients", value: "89", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Lab Dashboard</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Incoming Orders Feed */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Incoming Investigation Orders</h2>
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <p className="font-bold text-slate-900">
                                    {order.items?.map((i: any) => i.testName).join(', ') || 'Diagnostic Tests'}
                                </p>
                                <p className="text-sm text-slate-600">
                                    Patient: {order.patient?.firstName} {order.patient?.lastName} • Dr. {order.doctor?.lastName}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Received {new Date(order.createdAt).toLocaleTimeString()} • Status: <span className="font-medium text-blue-600">{order.status}</span>
                                </p>
                            </div>
                            <div className="flex gap-2">
                                {order.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                                        className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Accept & Process
                                    </button>
                                )}
                                {order.status === 'PROCESSING' && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                                        className="px-3 py-1.5 text-sm font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                    >
                                        Upload Results
                                    </button>
                                )}
                                {order.status === 'COMPLETED' && (
                                    <span className="text-sm text-slate-400 font-medium italic">Ready for Download</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && !loading && (
                        <div className="text-center py-6 text-slate-500 italic">No incoming orders found for your lab.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
