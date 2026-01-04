'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LabPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/lab/dashboard');
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Redirecting to dashboard...</p>
            </div>
        </div>
    );
}
