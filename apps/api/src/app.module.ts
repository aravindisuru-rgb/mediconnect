import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ReferralsModule } from './referrals/referrals.module';
import { InvestigationsModule } from './investigations/investigations.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { MedicationsModule } from './medications/medications.module';
import { BillingModule } from './billing/billing.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { VerificationModule } from './verification/verification.module';
import { RegistryModule } from './registry/registry.module';
import { VitalsModule } from './vitals/vitals.module';
import { MessagingModule } from './messaging/messaging.module';
import { DocumentsModule } from './documents/documents.module';
import { EmergencyModule } from './emergency/emergency.module';
import { TimelineModule } from './timeline/timeline.module';
import { PricingModule } from './pricing/pricing.module';
import { AuditInterceptor } from './audit/audit.interceptor';

import { PatientsModule } from './patients/patients.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        AppointmentsModule,
        ReferralsModule,
        InvestigationsModule,
        PrescriptionsModule,
        MedicationsModule,
        BillingModule,
        AuditModule,
        NotificationsModule,
        PatientsModule,
        VerificationModule,
        RegistryModule,
        VitalsModule,
        MessagingModule,
        DocumentsModule,
        EmergencyModule,
        PricingModule,
        TimelineModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditInterceptor,
        },
    ],
})
export class AppModule { }
