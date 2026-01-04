import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { OrderSetsService } from './order-sets.service';

@Controller('order-sets')
export class OrderSetsController {
    constructor(private orderSetsService: OrderSetsService) { }

    @Get()
    async getAllOrderSets(@Query('specialty') specialty?: string) {
        return this.orderSetsService.getAllOrderSets(specialty);
    }

    @Get('public')
    async getPublicOrderSets() {
        return this.orderSetsService.getPublicOrderSets();
    }

    @Get(':id')
    async getOrderSetById(@Param('id') id: string) {
        return this.orderSetsService.getOrderSetById(id);
    }

    @Post()
    async createOrderSet(@Body() body: any) {
        return this.orderSetsService.createOrderSet(body);
    }

    @Post(':id/use')
    async useOrderSet(@Param('id') id: string) {
        await this.orderSetsService.incrementUseCount(id);
        return { success: true };
    }

    @Post('seed')
    async seedOrderSets() {
        await this.orderSetsService.seedCommonOrderSets();
        return { success: true, message: 'Common order sets seeded' };
    }
}
