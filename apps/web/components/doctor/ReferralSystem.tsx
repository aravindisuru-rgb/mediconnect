import React from 'react';
import { Send, Search } from "lucide-react";

export function ReferralSystem() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">New Specialist Referral</h2>

            <div className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-center`}>
                        <p className="font-medium">Direct to Doctor</p>
                        <p className="text-xs text-slate-500">Refer to a specific colleague</p>
                    </div>
                    <div className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all text-center`}>
                        <p className="font-medium">To Specialty</p>
                        <p className="text-xs text-slate-500">Any valid specialist</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search specialist or department..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* Clinical Note */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Reason & Notes</label>
                    <textarea
                        className="w-full p-3 border border-slate-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Describe patient condition, reason for referral, and urgency..."
                    ></textarea>
                </div>

                {/* Attachments */}
                <div className="flex gap-2">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm">Attach Recent Labs</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm">Attach Medication History</span>
                    </label>
                </div>

                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Referral Letter
                </button>
            </div>
        </div>
    );
}
