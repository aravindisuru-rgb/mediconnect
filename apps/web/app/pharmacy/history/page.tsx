import { Search, Filter, FileText } from "lucide-react";

export default function DispenseHistoryPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dispense History</h1>
                    <p className="text-slate-500">View past prescriptions and fulfillment records</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg font-medium hover:bg-slate-50">
                    <Filter className="w-4 h-4" /> Filter Date
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Dispense ID</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Patient</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Medication</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Date/Time</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Pharmacist</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {[1, 2, 3].map((i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">#DSP-992{i}</td>
                                <td className="px-6 py-4">John Smith</td>
                                <td className="px-6 py-4">Amoxicillin 500mg</td>
                                <td className="px-6 py-4 text-slate-500">Jan 02, 2:30 PM</td>
                                <td className="px-6 py-4">C. Perera</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Completed
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
