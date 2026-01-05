'use client';

import Link from "next/link";
import { LayoutDashboard, Package, History, LogOut, DollarSign } from "lucide-react";

export default function PharmacyLayout({
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
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            MediPharma
                        </span>
                    </div>

                    <div className="flex-1 py-6 px-3 space-y-1">
                        <Link href="/pharmacy/dashboard" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                            <LayoutDashboard className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                        <Link href="/pharmacy/inventory" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                            <Package className="w-5 h-5 mr-3" />
                            Inventory
                        </Link>
                        <Link href="/pharmacy/history" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                            <History className="w-5 h-5 mr-3" />
                            Dispense History
                        </Link>
                        <Link href="/pharmacy/billing" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-emerald-600 transition-colors">
                            <DollarSign className="w-5 h-5 mr-3" />
                            Billing
                        </Link>
                    </div>

                    <div className="p-4 border-t border-slate-200">
                        <div className="flex items-center p-3 mb-2 rounded-lg bg-slate-50">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                PH
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-700">C. Perera</p>
                                <p className="text-xs text-slate-500">Head Pharmacist</p>
                            </div>
                        </div>
                        <button className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </button>
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
