import { Module } from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { EmergencyController } from './emergency.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [NotificationsModule],
    providers: [EmergencyService],
    controllers: [EmergencyController],
    exports: [EmergencyService]
})
export class EmergencyModule { }
