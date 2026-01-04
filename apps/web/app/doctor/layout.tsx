"use client";
import Link from "next/link";
import { useState } from "react";
import { User, Users, ClipboardList, Calendar, LogOut, Languages } from "lucide-react";
import { getTranslation, Language } from "../../lib/i18n/translations";

export default function DoctorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lang, setLang] = useState<Language>('en');

    const t = (key: any) => getTranslation(lang, key);

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200">
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-16 border-b border-slate-200 px-6">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            MediConnect
                        </span>
                    </div>

                    <div className="flex-1 py-6 px-3 space-y-1">
                        <Link href="/doctor/dashboard" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                            <Calendar className="w-5 h-5 mr-3" />
                            {t('dashboard')}
                        </Link>
                        <Link href="/doctor/patients" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                            <Users className="w-5 h-5 mr-3" />
                            {t('patients')}
                        </Link>
                        <Link href="/doctor/records" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                            <ClipboardList className="w-5 h-5 mr-3" />
                            {t('medicalRecords')}
                        </Link>
                        <Link href="/doctor/referrals" className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors">
                            <Users className="w-5 h-5 mr-3" />
                            Incoming Referrals
                        </Link>
                    </div>

                    <div className="p-4 border-t border-slate-200 space-y-4">
                        {/* Language Switcher */}
                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <Languages className="w-4 h-4 text-slate-400" />
                            <select
                                value={lang}
                                onChange={(e) => setLang(e.target.value as Language)}
                                className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
                            >
                                <option value="en">English</option>
                                <option value="si">සිංහල (Sinhala)</option>
                                <option value="ta">தமிழ் (Tamil)</option>
                            </select>
                        </div>

                        <div className="flex items-center p-3 rounded-lg bg-blue-50">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                DR
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-700">Dr. Silva</p>
                                <p className="text-xs text-slate-500">Cardiologist</p>
                            </div>
                        </div>
                        <button className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4 mr-2" />
                            {t('logout')}
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
