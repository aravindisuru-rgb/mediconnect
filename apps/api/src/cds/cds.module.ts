import { Module } from '@nestjs/common';
import { CdsController } from './cds.controller';
import { CdsService } from './cds.service';
import { LabFlaggingService } from './lab-flagging.service';

@Module({
    controllers: [CdsController],
    providers: [CdsService, LabFlaggingService],
    exports: [CdsService, LabFlaggingService],
})
export class CdsModule { }
