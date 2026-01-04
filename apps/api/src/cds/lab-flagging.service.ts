import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/db';

interface ReferenceRange {
    lowNormal: string;
    highNormal: string;
    criticalLow?: string;
    criticalHigh?: string;
    unit: string;
}

@Injectable()
export class LabFlaggingService {
    /**
     * Auto-flag a lab result based on reference ranges
     */
    async flagResult(
        testCode: string,
        value: string,
        patientAge?: number,
        patientGender?: string,
    ): Promise<{ flag: string; flagAutomated: string }> {
        // Get reference range for this test
        const referenceRange = await this.getReferenceRange(testCode, patientAge, patientGender);

        if (!referenceRange) {
            return { flag: 'UNKNOWN', flagAutomated: 'NO_RANGE' };
        }

        // Convert value to number if possible
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            return { flag: 'TEXT', flagAutomated: 'NON_NUMERIC' };
        }

        const lowNormal = parseFloat(referenceRange.lowNormal);
        const highNormal = parseFloat(referenceRange.highNormal);
        const criticalLow = referenceRange.criticalLow ? parseFloat(referenceRange.criticalLow) : null;
        const criticalHigh = referenceRange.criticalHigh ? parseFloat(referenceRange.criticalHigh) : null;

        // Check for critical values first
        if (criticalLow !== null && numericValue <= criticalLow) {
            return { flag: 'CRITICAL', flagAutomated: 'AUTO_CRITICAL_LOW' };
        }
        if (criticalHigh !== null && numericValue >= criticalHigh) {
            return { flag: 'CRITICAL', flagAutomated: 'AUTO_CRITICAL_HIGH' };
        }

        // Check for abnormal values
        if (numericValue < lowNormal) {
            return { flag: 'LOW', flagAutomated: 'AUTO_LOW' };
        }
        if (numericValue > highNormal) {
            return { flag: 'HIGH', flagAutomated: 'AUTO_HIGH' };
        }

        // Normal
        return { flag: 'NORMAL', flagAutomated: 'AUTO_NORMAL' };
    }

    /**
     * Calculate delta change from previous result
     */
    async calculateDelta(
        patientId: string,
        testCode: string,
        currentValue: string,
    ): Promise<{ deltaFlag: boolean; percentChange: number | null; previousValue: string | null }> {
        // Get most recent previous result
        const previousResults = await prisma.labResult.findMany({
            where: {
                testCode,
                investigationOrder: {
                    patientId,
                },
            },
            orderBy: {
                testedAt: 'desc',
            },
            take: 2, // Get last 2 results
        });

        if (previousResults.length < 2) {
            return { deltaFlag: false, percentChange: null, previousValue: null };
        }

        const previousValue = previousResults[1].value;
        const currentNumeric = parseFloat(currentValue);
        const previousNumeric = parseFloat(previousValue);

        if (isNaN(currentNumeric) || isNaN(previousNumeric) || previousNumeric === 0) {
            return { deltaFlag: false, percentChange: null, previousValue };
        }

        const percentChange = ((currentNumeric - previousNumeric) / Math.abs(previousNumeric)) * 100;

        // Flag if change is > 20%
        const deltaFlag = Math.abs(percentChange) > 20;

        return { deltaFlag, percentChange, previousValue };
    }

    /**
     * Get reference range for a test (age/gender-specific)
     */
    async getReferenceRange(
        testCode: string,
        patientAge?: number,
        patientGender?: string,
    ): Promise<ReferenceRange | null> {
        const ranges = await prisma.labTestReferenceRange.findMany({
            where: {
                testCode,
                OR: [
                    { gender: null },
                    { gender: 'ALL' },
                    { gender: patientGender?.toUpperCase() },
                ],
                AND: [
                    {
                        OR: [
                            { ageMin: null },
                            { ageMin: { lte: patientAge || 999 } },
                        ],
                    },
                    {
                        OR: [
                            { ageMax: null },
                            { ageMax: { gte: patientAge || 0 } },
                        ],
                    },
                ],
            },
        });

        if (ranges.length === 0) {
            return null;
        }

        // Return most specific range (with age/gender criteria)
        const sortedRanges = ranges.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;

            if (a.gender && a.gender !== 'ALL') scoreA += 2;
            if (b.gender && b.gender !== 'ALL') scoreB += 2;
            if (a.ageMin || a.ageMax) scoreA += 1;
            if (b.ageMin || b.ageMax) scoreB += 1;

            return scoreB - scoreA;
        });

        return sortedRanges[0];
    }

    /**
     * Seed some common reference ranges for demo
     */
    async seedReferenceRanges(): Promise<void> {
        const ranges = [
            // Hemoglobin - Age/Gender specific
            {
                testCode: 'HB',
                testName: 'Hemoglobin',
                gender: 'MALE',
                ageMin: 18,
                ageMax: null,
                unit: 'g/dL',
                lowNormal: '13.5',
                highNormal: '17.5',
                criticalLow: '7.0',
                criticalHigh: '20.0',
                source: 'WHO Guidelines',
            },
            {
                testCode: 'HB',
                testName: 'Hemoglobin',
                gender: 'FEMALE',
                ageMin: 18,
                ageMax: null,
                unit: 'g/dL',
                lowNormal: '12.0',
                highNormal: '15.5',
                criticalLow: '7.0',
                criticalHigh: '20.0',
                source: 'WHO Guidelines',
            },
            // Glucose
            {
                testCode: 'GLUC_FAST',
                testName: 'Fasting Blood Glucose',
                gender: 'ALL',
                ageMin: null,
                ageMax: null,
                unit: 'mg/dL',
                lowNormal: '70',
                highNormal: '100',
                criticalLow: '40',
                criticalHigh: '400',
                source: 'ADA 2024',
            },
            // Creatinine
            {
                testCode: 'CREAT',
                testName: 'Serum Creatinine',
                gender: 'MALE',
                ageMin: 18,
                ageMax: null,
                unit: 'mg/dL',
                lowNormal: '0.7',
                highNormal: '1.3',
                criticalHigh: '10.0',
                source: 'KDIGO',
            },
            {
                testCode: 'CREAT',
                testName: 'Serum Creatinine',
                gender: 'FEMALE',
                ageMin: 18,
                ageMax: null,
                unit: 'mg/dL',
                lowNormal: '0.6',
                highNormal: '1.1',
                criticalHigh: '10.0',
                source: 'KDIGO',
            },
            // Potassium
            {
                testCode: 'K',
                testName: 'Potassium',
                gender: 'ALL',
                ageMin: null,
                ageMax: null,
                unit: 'mEq/L',
                lowNormal: '3.5',
                highNormal: '5.0',
                criticalLow: '2.5',
                criticalHigh: '6.5',
                source: 'CAP',
            },
            // Sodium
            {
                testCode: 'NA',
                testName: 'Sodium',
                gender: 'ALL',
                ageMin: null,
                ageMax: null,
                unit: 'mEq/L',
                lowNormal: '136',
                highNormal: '145',
                criticalLow: '120',
                criticalHigh: '160',
                source: 'CAP',
            },
        ];

        for (const range of ranges) {
            await prisma.labTestReferenceRange.upsert({
                where: {
                    id: `seed-${range.testCode}-${range.gender}-${range.ageMin || 0}`,
                },
                create: {
                    id: `seed-${range.testCode}-${range.gender}-${range.ageMin || 0}`,
                    ...range,
                },
                update: range,
            });
        }
    }
}
