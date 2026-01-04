import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { BillingService } from './billing.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('billing')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
    constructor(private service: BillingService) { }

    @Get('pharmacy')
    async getPharmacyInvoices(@Request() req: any) {
        const pharmacyId = req.user.pharmacyId;
        if (!pharmacyId) return [];
        return this.service.findAllForPharmacy(pharmacyId);
    }

    @Get('lab')
    async getLabInvoices(@Request() req: any) {
        const labId = req.user.labId;
        if (!labId) return [];
        return this.service.findAllForLab(labId);
    }

    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body() body: any) {
        return this.service.updateStatus(id, body.status);
    }
}
