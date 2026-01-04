'use client';

import { Search, Plus, AlertCircle } from "lucide-react";

export default function InventoryPage() {
    const inventory = [
        { name: 'Amoxicillin 500mg', stock: 1200, unit: 'Capsules', status: 'In Stock' },
        { name: 'Metformin 500mg', stock: 50, unit: 'Tablets', status: 'Low Stock' },
        { name: 'Paracetamol 500mg', stock: 5000, unit: 'Tablets', status: 'In Stock' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
                    <p className="text-slate-500">Track medication stock levels</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Item
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg" />
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-900">Item Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Stock Level</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Unit</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-900">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {inventory.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                <td className="px-6 py-4">{item.stock}</td>
                                <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Low Stock' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-blue-600 font-medium text-sm hover:underline">Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
