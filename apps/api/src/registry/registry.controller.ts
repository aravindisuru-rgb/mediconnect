import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegistryService } from './registry.service';

@Controller('registry')
export class RegistryController {
    constructor(private service: RegistryService) { }

    @Get('doctor/verify/:slmc')
    verifyDoctor(@Param('slmc') slmc: string) {
        return this.service.verifyDoctor(slmc);
    }

    @Get('phm/areas')
    getPHMAreas() {
        return this.service.getAllPHMAreas();
    }

    @Get('phm/lookup')
    lookupPHM(@Query('code') code: string) {
        return this.service.findPHMSupport(code);
    }
}
