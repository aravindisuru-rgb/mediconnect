import React from 'react';
import { Activity, Thermometer, Droplets, Weight } from 'lucide-react';

export function PatientVitalsMonitor({ vitals }: { vitals: any }) {
    if (!vitals || Object.keys(vitals).length === 0) {
        return (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 italic">
                No patient-recorded vitals available for this period.
            </div>
        );
    }

    const Stat = ({ label, value, unit, icon: Icon, color }: any) => (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500 uppercase">{label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-slate-900">{value || '--'}</span>
                    <span className="text-xs text-slate-500">{unit}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Stat
                label="Blood Pressure"
                value={vitals.BP_SYSTOLIC ? `${vitals.BP_SYSTOLIC.value}/${vitals.BP_DIASTOLIC?.value}` : null}
                unit="mmHg"
                icon={Activity}
                color="bg-red-50 text-red-600"
            />
            <Stat
                label="Heart Rate"
                value={vitals.HEART_RATE?.value}
                unit="bpm"
                icon={Activity}
                color="bg-orange-50 text-orange-600"
            />
            <Stat
                label="Blood Sugar"
                value={vitals.GLUCOSE?.value}
                unit="mg/dL"
                icon={Droplets}
                color="bg-blue-50 text-blue-600"
            />
            <Stat
                label="Temperature"
                value={vitals.TEMP?.value}
                unit="°C"
                icon={Thermometer}
                color="bg-emerald-50 text-emerald-600"
            />
            <Stat
                label="Weight"
                value={vitals.WEIGHT?.value}
                unit="kg"
                icon={Weight}
                color="bg-purple-50 text-purple-600"
            />
        </div>
    );
}
