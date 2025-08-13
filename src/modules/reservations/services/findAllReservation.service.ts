import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/repositoriesTokens';
import { IReservationRepository } from '../domain/repositories/IReservations.repositories';

@Injectable()
export class FindAllReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  async execute() {
    return this.reservationRepository.findAll();
  }
}
