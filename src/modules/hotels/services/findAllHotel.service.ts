import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllHotelsService {
  execute() {
    return `This action returns all hotels`;
  }
}
