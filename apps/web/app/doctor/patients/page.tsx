import { Search, Filter } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await fetch('/api/patients');
                const data = await res.json();
                setPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
                    <p className="text-slate-500">Manage your patient records and history</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Add New Patient
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search patients by name, ID, or NIC..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                </button>
            </div>

            {/* Patient Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Name / ID</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Age / Gender</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Last Visit</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Condition</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {patients.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                            {p.firstName[0]}{p.lastName[0]}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-medium text-slate-900">{p.firstName} {p.lastName}</div>
                                            <div className="text-sm text-slate-500">ID: #{p.id.slice(0, 8)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-slate-900">{p.age} Years</div>
                                    <div className="text-sm text-slate-500">{p.gender}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {p.appointments?.[0] ? new Date(p.appointments[0].startTime).toLocaleDateString() : 'No visits'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Clinical Record
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-emerald-600 font-medium">Active</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/doctor/patients/${p.id}`} className="text-blue-600 hover:text-blue-900 font-medium text-sm">View Profile</Link>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && !loading && (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">No patients found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
