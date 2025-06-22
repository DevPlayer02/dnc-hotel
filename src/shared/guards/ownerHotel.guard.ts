import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/modules/auth/auth.service';
import { FindOneHotelService } from 'src/modules/hotels/services/findOneHotel.service';

@Injectable()
export class OwnerHotelGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly hotelService: FindOneHotelService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const hotelId = req.params.id;

    const user = req.user;

    if (!user) return false;

    const hotel = await this.hotelService.execute(hotelId);

    if (!hotel) return false;

    return hotel.ownerId === user.id;
  }
}
