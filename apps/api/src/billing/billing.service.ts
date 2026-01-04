import { Injectable, BadRequestException } from '@nestjs/common';
import { prisma, Invoice, Prisma } from '@repo/db';

@Injectable()
export class BillingService {
    async createFromPrescription(prescriptionId: string, pharmacyId: string) {
        const rx = await prisma.prescription.findUnique({
            where: { id: prescriptionId },
            include: { items: true, patient: true }
        });

        if (!rx) throw new BadRequestException("Prescription not found");

        // Simple pricing logic: Use inventory price or default 250 LKR
        let total = 0;
        const lineItems = [];

        for (const item of rx.items) {
            const inventory = await prisma.pharmacyInventory.findFirst({
                where: { pharmacyId, medicationName: item.medicationName }
            });
            const price = inventory ? inventory.pricePerUnit : new Prisma.Decimal(250);
            const subtotal = new Prisma.Decimal(1).mul(price); // Simplified: qty 1 for now
            total += Number(subtotal);

            lineItems.push({
                description: item.medicationName,
                quantity: 1,
                unitPrice: price,
                subtotal: subtotal
            });
        }

        return prisma.invoice.create({
            data: {
                patientId: rx.patientId,
                pharmacyId: pharmacyId,
                prescriptionId: rx.id,
                totalAmount: new Prisma.Decimal(total),
                status: 'UNPAID',
                items: {
                    create: lineItems
                }
            }
        });
    }

    async createFromInvestigation(orderId: string, labId: string) {
        const order = await prisma.investigationOrder.findUnique({
            where: { id: orderId },
            include: { patient: true }
        });

        if (!order) throw new BadRequestException("Investigation order not found");

        // Fetch prices from catalog for test codes
        let total = 0;
        const lineItems = [];

        for (const code of order.testCodes) {
            const catalog = await prisma.labTestCatalog.findFirst({
                where: { labId, testCode: code }
            });
            const price = catalog ? catalog.price : new Prisma.Decimal(1500); // Default lab cost
            total += Number(price);

            lineItems.push({
                description: catalog ? catalog.testName : `Test Code: ${code}`,
                quantity: 1,
                unitPrice: price,
                subtotal: price
            });
        }

        return prisma.invoice.create({
            data: {
                patientId: order.patientId,
                labId: labId,
                investigationOrderId: order.id,
                totalAmount: new Prisma.Decimal(total),
                status: 'UNPAID',
                items: {
                    create: lineItems
                }
            }
        });
    }

    async findAllForPharmacy(pharmacyId: string) {
        return prisma.invoice.findMany({
            where: { pharmacyId },
            include: { patient: true, items: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findAllForLab(labId: string) {
        return prisma.invoice.findMany({
            where: { labId },
            include: { patient: true, items: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateStatus(id: string, status: string) {
        return prisma.invoice.update({
            where: { id },
            data: { status }
        });
    }
}
