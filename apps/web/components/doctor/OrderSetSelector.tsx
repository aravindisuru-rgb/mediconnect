'use client';

import React, { useState, useEffect } from 'react';
import { Zap, ChevronDown, Plus } from 'lucide-react';

interface OrderSet {
    id: string;
    name: string;
    category: string;
    description: string;
    specialty?: string;
    useCount: number;
    items: Array<{
        testCategory: string;
        testName: string;
        testCode?: string;
        isRequired: boolean;
        instructions?: string;
    }>;
}

interface OrderSetSelectorProps {
    onSelect: (tests: Array<{ category: string; testName: string; testCode?: string }>) => void;
}

export function OrderSetSelector({ onSelect }: OrderSetSelectorProps) {
    const [orderSets, setOrderSets] = useState<OrderSet[]>([]);
    const [selectedSet, setSelectedSet] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrderSets();
    }, []);

    const fetchOrderSets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/order-sets/public');
            if (res.ok) {
                const data = await res.json();
                setOrderSets(data);
            }
        } catch (error) {
            console.error('Failed to fetch order sets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOrderSet = async (orderSet: OrderSet) => {
        setSelectedSet(orderSet.id);

        // Convert order set items to test selection format
        const tests = orderSet.items.map(item => ({
            category: item.testCategory,
            testName: item.testName,
            testCode: item.testCode,
        }));

        // Increment use count
        try {
            await fetch(`/api/order-sets/${orderSet.id}/use`, { method: 'POST' });
        } catch (error) {
            console.error('Failed to increment use count:', error);
        }

        onSelect(tests);

        // Reset selection after a brief delay
        setTimeout(() => setSelectedSet(null), 1000);
    };

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            PREOP: 'bg-purple-100 text-purple-800',
            SCREENING: 'bg-blue-100 text-blue-800',
            DIAGNOSTIC: 'bg-orange-100 text-orange-800',
            MONITORING: 'bg-green-100 text-green-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="text-center text-sm text-gray-600 py-4">
                Loading order sets...
            </div>
        );
    }

    if (orderSets.length === 0) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-5">
            <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-900">Quick Order Sets</h3>
                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                    {orderSets.length} available
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {orderSets.map((set) => (
                    <div
                        key={set.id}
                        className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${selectedSet === set.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-transparent hover:border-blue-300'
                            }`}
                        onClick={() => handleSelectOrderSet(set)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900">{set.name}</h4>
                                <p className="text-xs text-gray-600 mt-1">{set.description}</p>
                            </div>
                            {selectedSet === set.id ? (
                                <div className="flex-shrink-0 ml-2">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-white rotate-45" />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-shrink-0 ml-2">
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryBadge(set.category)}`}>
                                {set.category}
                            </span>
                            {set.specialty && (
                                <span className="text-xs text-gray-500">{set.specialty}</span>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">
                                {set.items.length} tests
                            </span>
                        </div>

                        {/* Show items on hover or selection */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-600 space-y-0.5">
                                {set.items.slice(0, 3).map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1">
                                        <span className="text-blue-500">•</span>
                                        <span>{item.testName}</span>
                                        {!item.isRequired && (
                                            <span className="text-gray-400 italic">(optional)</span>
                                        )}
                                    </div>
                                ))}
                                {set.items.length > 3 && (
                                    <div className="text-gray-400 italic">
                                        +{set.items.length - 3} more...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
                Click on an order set to quickly add all tests to your order
            </div>
        </div>
    );
}
