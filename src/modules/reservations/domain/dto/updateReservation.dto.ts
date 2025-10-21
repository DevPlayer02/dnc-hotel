import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './createReservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
