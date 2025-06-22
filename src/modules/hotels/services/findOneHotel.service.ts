import { Injectable } from '@nestjs/common';

@Injectable()
export class FindOneHotelService {
  execute(id: number) {
    return `This action returns a #${id} hotel`;
  }
}
