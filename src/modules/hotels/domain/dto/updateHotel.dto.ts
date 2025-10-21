import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './createHotel.dto';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {}
