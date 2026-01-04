import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

@Injectable()
export class PricingService {
    async getPharmacyQuotes(prescriptionId: string) {
        const prescription = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { items: true }
        });

        if (!prescription) return [];

        // In a real app, we'd query multiple pharmacy inventories
        // For this demo, we mock quotes from 3 standard pharmacies
        const pharmacies = [
            { name: 'City Central Pharmacy', id: 'ph-1', distance: '0.5km' },
            { name: 'MediCare Wellness', id: 'ph-2', distance: '1.2km' },
            { name: 'National Health Pharmacy', id: 'ph-3', distance: '3.0km' }
        ];

        return pharmacies.map(ph => ({
            pharmacy: ph.name,
            pharmacyId: ph.id,
            distance: ph.distance,
            totalPrice: this.calculateMockPrice(prescription.items, ph.id),
            estimatedWaitTime: Math.floor(Math.random() * 20) + 10 + ' mins'
        }));
    }

    private calculateMockPrice(items: any[], phId: string) {
        // Base price + pharmacy specific variance
        const base = items.length * 1500;
        const variance = phId === 'ph-3' ? 0.9 : 1.1; // ph-3 is government/subsidized
        return Math.floor(base * variance);
    }
}
