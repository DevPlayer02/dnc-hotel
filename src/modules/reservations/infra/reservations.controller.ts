import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/createReservation.dto';
import { CreateReservationsService } from '../services/createReservations.service';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FindAllReservationsService } from '../services/findAllReservation.service';
import { FindByIdReservationsService } from '../services/findByIdReservation.service';
import { ParamId } from 'src/shared/decorators/paramId.decorator';
import { FindByUserReservationsService } from '../services/findByUserReservation.service';
import { ReservationStatus, Role } from '@prisma/client';
import { updateStatusReservationsService } from '../services/UpdateStatusReservation.service';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorators';

@UseGuards(AuthGuard, RoleGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly createReservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findByIdReservationsService: FindByIdReservationsService,
    private readonly findByUserReservationsService: FindByUserReservationsService,
    private readonly updateStatusReservationsService: updateStatusReservationsService,
  ) {}

  @Roles(Role.USER)
  @Post()
  create(@User('id') id: number, @Body() body: CreateReservationDto) {
    return this.createReservationsService.execute(id, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }

  @Get('user')
  findByUser(@User('id') id: number) {
    return this.findByUserReservationsService.execute(id);
  }

  @Get(':id')
  findOne(@ParamId() id: number) {
    return this.findByIdReservationsService.execute(id);
  }

  @Patch(':id')
  updateStatus(
    @ParamId() id: number,
    @Body('status') status: ReservationStatus,
  ) {
    return this.updateStatusReservationsService.execute(id, status);
  }
}
