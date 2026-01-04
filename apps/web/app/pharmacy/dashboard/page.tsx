import { Search, Package, Clock, CheckCircle } from "lucide-react";

import { useState, useEffect } from 'react';

export default function PharmacyDashboard() {
   const [prescriptions, setPrescriptions] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchPrescriptions = async () => {
         try {
            const res = await fetch('/api/prescriptions/pharmacy/incoming');
            const data = await res.json();
            setPrescriptions(data);
         } catch (e) {
            console.error("Error fetching prescriptions", e);
         } finally {
            setLoading(false);
         }
      };
      fetchPrescriptions();
   }, []);

   const handleDispense = async (id: string) => {
      const res = await fetch(`/api/medications/fill-prescription/${id}`, { method: 'POST' });
      if (res.ok) {
         alert("Prescription Dispensed & Drug Chart Updated");
         setPrescriptions(prescriptions.map(rx => rx.id === id ? { ...rx, status: 'FILLED' } : rx));
      } else {
         alert("Error dispensing prescription");
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-bold text-slate-900">Pharmacy Overview</h1>
               <p className="text-slate-500">Manage prescriptions and inventory</p>
            </div>
            <div className="flex gap-3">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50">
                  <Package className="w-4 h-4" /> Inventory
               </button>
               <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700">
                  <CheckCircle className="w-4 h-4" /> Scan New RX
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-700">Queue Status</h3>
                  <Clock className="w-5 h-5 text-orange-500" />
               </div>
               <div className="text-3xl font-bold text-slate-900">12 <span className="text-sm font-normal text-slate-500">Pending</span></div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-700">Ready for Pickup</h3>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
               </div>
               <div className="text-3xl font-bold text-slate-900">5 <span className="text-sm font-normal text-slate-500">Orders</span></div>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
               <h2 className="font-bold text-lg">Incoming Prescriptions</h2>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                     type="text"
                     placeholder="Search RX ID..."
                     className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm"
                  />
               </div>
            </div>
            <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                     <th className="px-6 py-4 text-sm font-semibold text-slate-900">RX ID</th>
                     <th className="px-6 py-4 text-sm font-semibold text-slate-900">Patient</th>
                     <th className="px-6 py-4 text-sm font-semibold text-slate-900">Doctor</th>
                     <th className="px-6 py-4 text-sm font-semibold text-slate-900">Items</th>
                     <th className="px-6 py-4 text-sm font-semibold text-slate-900">Received At</th>
                     <th className="px-6 py-4 text-sm font-semibold text-slate-900">Status</th>
                     <th className="px-6 py-4 text-sm font-semibold text-slate-900">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200">
                  {prescriptions.map((rx: any) => (
                     <tr key={rx.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-medium text-blue-600">RX-{rx.id.slice(0, 5)}</td>
                        <td className="px-6 py-4">{rx.patient?.firstName} {rx.patient?.lastName}</td>
                        <td className="px-6 py-4">Dr. {rx.doctor?.lastName}</td>
                        <td className="px-6 py-4">{rx.items?.length || 0} Meds</td>
                        <td className="px-6 py-4 text-slate-500">{new Date(rx.createdAt).toLocaleTimeString()}</td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rx.status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                              {rx.status}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           {rx.status === 'PENDING' ? (
                              <button
                                 onClick={() => handleDispense(rx.id)}
                                 className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                              >
                                 Review & Fill
                              </button>
                           ) : (
                              <span className="text-sm text-slate-400">Dispensed</span>
                           )}
                        </td>
                     </tr>
                  ))}
                  {prescriptions.length === 0 && !loading && (
                     <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-slate-500">No incoming prescriptions for this pharmacy.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}
