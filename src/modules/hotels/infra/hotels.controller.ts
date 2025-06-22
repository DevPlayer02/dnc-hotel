import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateHotelsService } from '../services/createHotel.service';
import { FindAllHotelsService } from '../services/findAllHotel.service';
import { FindOneHotelService } from '../services/findOneHotel.service';
import { RemoveHotelService } from '../services/removeHotel.service';
import { UpdateHotelService } from '../services/updateHotel.service';
import { CreateHotelDto } from '../domain/dto/createHotel.dto';
import { UpdateHotelDto } from '../domain/dto/updateHotel.dto';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { FindByNameHotelsService } from '../services/findByNameHotel.service';
import { FindByOwnerHotelsService } from '../services/findByOwnerHotel.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Role } from 'generated/prisma';
import { Roles } from 'src/shared/decorators/roles.decorators';
import { OwnerHotelGuard } from 'src/shared/guards/ownerHotel.guard';
import { User } from 'src/shared/decorators/user.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotelsService: CreateHotelsService,
    private readonly findAllHotelsService: FindAllHotelsService,
    private readonly findOneHotelService: FindOneHotelService,
    private readonly findByNameHotelsService: FindByNameHotelsService,
    private readonly findByOwnerHotelsService: FindByOwnerHotelsService,
    private readonly updateHotelService: UpdateHotelService,
    private readonly removeHotelService: RemoveHotelService,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createHotelDto: CreateHotelDto) {
    return this.createHotelsService.execute(createHotelDto);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll() {
    return this.findAllHotelsService.execute();
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findOneHotelService.execute(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':name')
  findName(@Query('name') name: string) {
    return this.findByNameHotelsService.execute(name);
  }

  @Roles(Role.ADMIN)
  @Get(':owner')
  findOwner(@User('id') id: number) {
    return this.findByOwnerHotelsService.execute(id);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@ParamId() id: number, @Body() updateHotelDto: UpdateHotelDto) {
    return this.updateHotelService.execute(id, updateHotelDto);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@ParamId() id: number) {
    return this.removeHotelService.execute(id);
  }
}
