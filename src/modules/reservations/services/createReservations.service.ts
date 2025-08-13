import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/createReservation.dto';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/repositoriesTokens';
import { IReservationRepository } from '../domain/repositories/IReservations.repositories';
import { differenceInDays, parseISO } from 'date-fns';
import { IHotelRepository } from 'src/modules/hotels/domain/repositories/IHotel.repositories';
import { ReservationStatus } from 'generated/prisma';
import { HOTEL_REPOSITORY_TOKEN } from 'src/modules/hotels/utils/repositoriesTokens';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/modules/users/user.services';

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationRepository: IReservationRepository,
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelsRepository: IHotelRepository,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async execute(id: number, data: CreateReservationDto) {
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);
    const daysOfStay = differenceInDays(checkInDate, checkOutDate);

    if (checkInDate >= checkOutDate) {
      throw new BadRequestException(
        'Check-out date must be after check-in date.',
      );
    }

    const hotel = await this.hotelsRepository.findHotelById(data.hotelId);

    if (!hotel) {
      throw new NotFoundException('Hotel not found.');
    }

    if (typeof hotel.price !== 'number' || hotel.price <= 0) {
      throw new BadRequestException('Invalid hotel price');
    }

    const total = daysOfStay * hotel.price;

    const newReservation = {
      ...data,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      total,
      userId: id,
      status: ReservationStatus.PENDING,
    };

    const hotelOwner = await this.userService.show(hotel.ownerId);
    const reservation = await this.reservationRepository.findbyId(id)

    await this.mailerService.sendMail({
      to: hotelOwner.email,
      subject: 'Pending Reservation Approval',
      html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial; background-color:#f4f4f5; padding:20px; width:100%; box-sizing:border-box;">
        <div style="display:none; max-height:0; max-width:0; overflow:hidden; opacity:0; color:transparent; height:0; width:0;">Your reservation is pending approval. Please review to confirm your stay.</div>
        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="padding:0 20px 24px 20px;">
            <h1 style="margin:0 0 8px 0; font-size:22px; color:#111827;">Pending Reservation Approval</h1>
            <p style="margin:0 0 12px 0; color:#374151;">Hi ${hotelOwner.name},</p>
            <p style="margin:0 0 12px 0; color:#374151;">
              Thanks for reserving with <strong>${hotelOwner.name}</strong>. Your reservation (ID: <strong>${reservation?.id}</strong>) is currently <strong>pending approval</strong>. Our team will review and confirm your booking shortly.
            </p>
            <table role="table" aria-label="Reservation details" style="width:100%; border-collapse:collapse; margin:12px 0 16px 0;">
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151; width:40%;"><strong>Hotel</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">${hotelOwner.name}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;"><strong>Check-in</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">${reservation?.checkIn}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;"><strong>Check-out</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">${reservation?.checkOut}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;"><strong>Total</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">${reservation?.total}</td>
              </tr>
            </table>
            <div style="text-align:center; padding:18px 0 0 0;">
              <a href="{{approvalLink}}" target="_blank" rel="noopener noreferrer" style="display:inline-block; text-decoration:none; padding:12px 20px; border-radius:6px; background-color:#ff6300; color:#ffffff; font-weight:600;">View reservation status</a>
            </div>
            <p style="margin:16px 0 0 0; color:#6b7280; font-size:13px;">
              If you need to change or cancel the reservation, please contact us at <a href="mailto:${hotelOwner.email}" style="color:#6b7280; text-decoration:underline;">${hotelOwner.email}</a>.
            </p>
            <p style="margin:12px 0 0 0; color:#6b7280; font-size:13px;">
              If you did not make this reservation or believe this is an error, please ignore this email or contact support.
            </p>
          </div>
          <div style="background:#f9fafb; padding:12px 20px; font-size:12px; color:#9ca3af; text-align:center;">
            <div style="margin-bottom:6px;">© ${hotel.name} • All rights reserved</div>
            <div style="font-size:11px;">To stop receiving these emails, change your notification settings in your account.</div>
          </div>
        </div>
      </div>
      `,
    });

    return this.reservationRepository.create(newReservation);
  }
}
