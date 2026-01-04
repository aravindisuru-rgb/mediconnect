import { Module } from '@nestjs/common';
import { InvestigationsService } from './investigations.service';
import { InvestigationsController } from './investigations.controller';
import { BillingModule } from '../billing/billing.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [BillingModule, NotificationsModule],
    providers: [InvestigationsService],
    controllers: [InvestigationsController],
})
export class InvestigationsModule { }
