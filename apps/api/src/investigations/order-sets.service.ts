import { Injectable } from '@nestjs/common';
import { prisma, InvestigationOrderSet, InvestigationOrderSetItem } from '@repo/db';

@Injectable()
export class OrderSetsService {
    /**
     * Get all active order sets
     */
    async getAllOrderSets(specialty?: string): Promise<InvestigationOrderSet[]> {
        return prisma.investigationOrderSet.findMany({
            where: {
                isActive: true,
                ...(specialty ? { specialty } : {}),
            },
            include: {
                items: {
                    orderBy: {
                        displayOrder: 'asc',
                    },
                },
            },
            orderBy: {
                useCount: 'desc', // Most popular first
            },
        });
    }

    /**
     * Get public order sets (available to all doctors)
     */
    async getPublicOrderSets(): Promise<InvestigationOrderSet[]> {
        return prisma.investigationOrderSet.findMany({
            where: {
                isActive: true,
                isPublic: true,
            },
            include: {
                items: true,
            },
        });
    }

    /**
     * Get order set by ID
     */
    async getOrderSetById(id: string): Promise<InvestigationOrderSet | null> {
        return prisma.investigationOrderSet.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });
    }

    /**
     * Create custom order set
     */
    async createOrderSet(data: {
        name: string;
        category: string;
        description: string;
        specialty?: string;
        createdBy: string;
        isPublic?: boolean;
        items: Array<{
            testCategory: string;
            testName: string;
            testCode?: string;
            isRequired?: boolean;
            instructions?: string;
            displayOrder?: number;
        }>;
    }): Promise<InvestigationOrderSet> {
        return prisma.investigationOrderSet.create({
            data: {
                name: data.name,
                category: data.category,
                description: data.description,
                specialty: data.specialty,
                createdBy: data.createdBy,
                isPublic: data.isPublic || false,
                items: {
                    create: data.items,
                },
            },
            include: {
                items: true,
            },
        });
    }

    /**
     * Increment use count when order set is used
     */
    async incrementUseCount(orderSetId: string): Promise<void> {
        await prisma.investigationOrderSet.update({
            where: { id: orderSetId },
            data: {
                useCount: {
                    increment: 1,
                },
            },
        });
    }

    /**
     * Seed common clinical order sets
     */
    async seedCommonOrderSets(): Promise<void> {
        const orderSets = [
            {
                id: 'seed-preop-basic',
                name: 'Preoperative Workup (Basic)',
                category: 'PREOP',
                description: 'Standard preoperative investigations for low-risk surgery',
                specialty: 'SURGERY',
                isPublic: true,
                createdBy: 'system',
                items: [
                    { testCategory: 'HEMATOLOGICAL', testName: 'Complete Blood Count (CBC)', testCode: 'CBC', isRequired: true, displayOrder: 1 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Blood Glucose (Fasting)', testCode: 'GLUC_FAST', isRequired: true, displayOrder: 2 },
                    { testCategory: 'HEMATOLOGICAL', testName: 'PT/INR', testCode: 'PT_INR', isRequired: true, displayOrder: 3 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Serum Creatinine', testCode: 'CREAT', isRequired: true, displayOrder: 4 },
                    { testCategory: 'RADIOLOGICAL', testName: 'Chest X-Ray (PA view)', testCode: 'CXR_PA', isRequired: false, displayOrder: 5, instructions: 'Only if >50 years or cardiopulmonary disease' },
                    { testCategory: 'BIOCHEMICAL', testName: 'ECG', testCode: 'ECG', isRequired: false, displayOrder: 6, instructions: 'If >40 years or cardiac risk factors' },
                ],
            },
            {
                id: 'seed-diabetes-screening',
                name: 'Diabetes Screening Panel',
                category: 'SCREENING',
                description: 'Comprehensive diabetes screening and monitoring',
                specialty: 'ENDOCRINOLOGY',
                isPublic: true,
                createdBy: 'system',
                items: [
                    { testCategory: 'BIOCHEMICAL', testName: 'HbA1c', testCode: 'HBA1C', isRequired: true, displayOrder: 1 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Fasting Blood Glucose', testCode: 'GLUC_FAST', isRequired: true, displayOrder: 2 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Lipid Panel', testCode: 'LIPID', isRequired: true, displayOrder: 3 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Serum Creatinine & eGFR', testCode: 'CREAT', isRequired: true, displayOrder: 4 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Urine Albumin/Creatinine Ratio', testCode: 'UACR', isRequired: true, displayOrder: 5 },
                ],
            },
            {
                id: 'seed-cardiac-workup',
                name: 'Cardiac Evaluation Package',
                category: 'DIAGNOSTIC',
                description: 'Comprehensive cardiac assessment',
                specialty: 'CARDIOLOGY',
                isPublic: true,
                createdBy: 'system',
                items: [
                    { testCategory: 'RADIOLOGICAL', testName: 'ECG (12-lead)', testCode: 'ECG', isRequired: true, displayOrder: 1 },
                    { testCategory: 'RADIOLOGICAL', testName: 'Chest X-Ray (PA & Lateral)', testCode: 'CXR', isRequired: true, displayOrder: 2 },
                    { testCategory: 'RADIOLOGICAL', testName: 'Echocardiogram', testCode: 'ECHO', isRequired: true, displayOrder: 3 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Cardiac Markers (Troponin, CK-MB)', testCode: 'CARDIAC_MARKERS', isRequired: true, displayOrder: 4 },
                    { testCategory: 'BIOCHEMICAL', testName: 'BNP/NT-proBNP', testCode: 'BNP', isRequired: false, displayOrder: 5 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Lipid Panel', testCode: 'LIPID', isRequired: true, displayOrder: 6 },
                ],
            },
            {
                id: 'seed-anemia-workup',
                name: 'Anemia Investigation',
                category: 'DIAGNOSTIC',
                description: 'Comprehensive anemia workup',
                specialty: null,
                isPublic: true,
                createdBy: 'system',
                items: [
                    { testCategory: 'HEMATOLOGICAL', testName: 'Complete Blood Count with Differential', testCode: 'CBC_DIFF', isRequired: true, displayOrder: 1 },
                    { testCategory: 'HEMATOLOGICAL', testName: 'Reticulocyte Count', testCode: 'RETIC', isRequired: true, displayOrder: 2 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Serum Iron', testCode: 'FE', isRequired: true, displayOrder: 3 },
                    { testCategory: 'BIOCHEMICAL', testName: 'TIBC (Total Iron Binding Capacity)', testCode: 'TIBC', isRequired: true, displayOrder: 4 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Ferritin', testCode: 'FERRITIN', isRequired: true, displayOrder: 5 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Vitamin B12 & Folate', testCode: 'B12_FOLATE', isRequired: true, displayOrder: 6 },
                    { testCategory: 'HEMATOLOGICAL', testName: 'Peripheral Smear', testCode: 'PBS', isRequired: false, displayOrder: 7 },
                ],
            },
            {
                id: 'seed-thyroid-panel',
                name: 'Thyroid Function Panel',
                category: 'SCREENING',
                description: 'Complete thyroid assessment',
                specialty: 'ENDOCRINOLOGY',
                isPublic: true,
                createdBy: 'system',
                items: [
                    { testCategory: 'BIOCHEMICAL', testName: 'TSH', testCode: 'TSH', isRequired: true, displayOrder: 1 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Free T4', testCode: 'FT4', isRequired: true, displayOrder: 2 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Free T3', testCode: 'FT3', isRequired: false, displayOrder: 3 },
                    { testCategory: 'BIOCHEMICAL', testName: 'Anti-TPO Antibodies', testCode: 'ANTI_TPO', isRequired: false, displayOrder: 4, instructions: 'If suspected autoimmune thyroid disease' },
                ],
            },
        ];

        for (const orderSet of orderSets) {
            await prisma.investigationOrderSet.upsert({
                where: { id: orderSet.id },
                create: {
                    ...orderSet,
                    items: {
                        create: orderSet.items.map((item) => ({
                            ...item,
                            id: `${orderSet.id}-item-${item.displayOrder}`,
                        })),
                    },
                },
                update: {
                    ...orderSet,
                },
            });
        }
    }
}
