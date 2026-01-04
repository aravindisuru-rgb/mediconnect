import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pricing')
@UseGuards(AuthGuard('jwt'))
export class PricingController {
    constructor(private service: PricingService) { }

    @Get('pharmacy-quotes/:prescriptionId')
    async getQuotes(@Param('prescriptionId') prescriptionId: string) {
        return this.service.getPharmacyQuotes(prescriptionId);
    }
}
