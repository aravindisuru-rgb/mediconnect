-- AlterTable
ALTER TABLE "Allergy" ADD COLUMN     "allergenType" TEXT NOT NULL DEFAULT 'DRUG',
ADD COLUMN     "verifiedBy" TEXT;

-- AlterTable
ALTER TABLE "LabResult" ADD COLUMN     "deltaFlag" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "flagAutomated" TEXT,
ADD COLUMN     "percentChange" DOUBLE PRECISION,
ADD COLUMN     "previousValue" TEXT;

-- CreateTable
CREATE TABLE "DrugInteraction" (
    "id" TEXT NOT NULL,
    "drug1Name" TEXT NOT NULL,
    "drug1Generic" TEXT,
    "drug2Name" TEXT NOT NULL,
    "drug2Generic" TEXT,
    "interactionLevel" TEXT NOT NULL,
    "mechanism" TEXT,
    "clinicalEffect" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "references" TEXT,

    CONSTRAINT "DrugInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTestReferenceRange" (
    "id" TEXT NOT NULL,
    "testCode" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "gender" TEXT,
    "pregnancyStatus" TEXT,
    "unit" TEXT NOT NULL,
    "lowNormal" TEXT NOT NULL,
    "highNormal" TEXT NOT NULL,
    "criticalLow" TEXT,
    "criticalHigh" TEXT,
    "source" TEXT,

    CONSTRAINT "LabTestReferenceRange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DrugInteraction_drug1Name_drug2Name_idx" ON "DrugInteraction"("drug1Name", "drug2Name");

-- CreateIndex
CREATE INDEX "LabTestReferenceRange_testCode_idx" ON "LabTestReferenceRange"("testCode");
