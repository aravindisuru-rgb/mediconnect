'use client';

import Link from "next/link";
import { LayoutDashboard, TestTube, CreditCard, LogOut } from "lucide-react";

export default function LabLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 border-b border-slate-200 px-6">
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
                            MediLab
                        </span>
                    </div>

                    <div className="flex-1 py-6 px-3 space-y-1">
                        <Link href="/lab/dashboard" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-purple-600 transition-colors">
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                        <Link href="/lab/orders" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-purple-600 transition-colors">
                            <TestTube className="w-5 h-5 mr-3" />
                            Test Orders
                        </Link>
                        <Link href="/lab/billing" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-purple-600 transition-colors">
                            <CreditCard className="w-5 h-5 mr-3" />
                            Pricing & Billing
                        </Link>
                    </div>

                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center p-3 mb-2 rounded-lg bg-slate-50">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                LT
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-700">Tech. Jaya</p>
                                <p className="text-xs text-slate-500">Lab Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
