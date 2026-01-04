import { Module } from '@nestjs/common';
import { InvestigationsService } from './investigations.service';
import { InvestigationsController } from './investigations.controller';
import { OrderSetsService } from './order-sets.service';
import { OrderSetsController } from './order-sets.controller';
import { BillingModule } from '../billing/billing.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [BillingModule, NotificationsModule],
    providers: [InvestigationsService, OrderSetsService],
    controllers: [InvestigationsController, OrderSetsController],
    exports: [OrderSetsService],
})
export class InvestigationsModule { }
