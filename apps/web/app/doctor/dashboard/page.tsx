'use client';

import { Users, Clock, AlertCircle, TrendingUp } from "lucide-react";

export default function DoctorDashboard() {
    const stats = [
        { title: "Today's Appointments", value: "8", icon: Clock, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Pending Reviews", value: "3", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
        { title: "Total Patients", value: "1,240", icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "Weekly Growth", value: "+12%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <span className="text-sm text-slate-500">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Appointments */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Upcoming Appointments</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                            JS
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">John Smith</p>
                                            <p className="text-sm text-slate-500">General Checkup</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-900">10:30 AM</p>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Confirmed
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Lab Results */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Lab Results</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                                <div>
                                    <p className="font-medium text-slate-900">Sarah Jones - Lipid Panel</p>
                                    <p className="text-sm text-red-600">Action Required: High Cholesterol</p>
                                </div>
                                <button className="text-sm font-medium text-red-700 hover:text-red-800">Review</button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Mike Ross - Blood Count</p>
                                    <p className="text-sm text-slate-500">Normal Range</p>
                                </div>
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-800">View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
