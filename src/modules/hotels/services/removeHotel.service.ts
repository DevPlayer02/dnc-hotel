import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveHotelService {
  execute(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
