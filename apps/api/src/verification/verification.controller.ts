import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('verification')
export class VerificationController {
    constructor(private service: VerificationService) { }

    @Post('nic')
    verifyNIC(@Body('nic') nic: string) {
        return this.service.verifyNIC(nic);
    }
}
