import { Inject, Injectable } from '@nestjs/common';
import { REPOSITORY_TOKEN_RESERVATION } from '../utils/repositoriesTokens';
import { IReservationRepository } from '../domain/repositories/IReservations.repositories';
import { ReservationStatus } from 'generated/prisma';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/modules/users/user.services';

@Injectable()
export class updateStatusReservationsService {
  constructor(
    @Inject(REPOSITORY_TOKEN_RESERVATION)
    private readonly reservationRepository: IReservationRepository,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async execute(id: number, status: ReservationStatus) {
    const reservation = await this.reservationRepository.updateStatus(
      id,
      status,
    );
    const user = await this.userService.show(reservation.userId);

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Pending Reservation Approval',
      html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial; background-color:#f4f4f5; padding:20px; width:100%; box-sizing:border-box;">
        <div style="display:none; max-height:0; max-width:0; overflow:hidden; opacity:0; color:transparent; height:0; width:0;">Great news — your reservation has been approved. See details inside.</div>
        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <div style="padding:0 20px 24px 20px;">
            <h1 style="margin:0 0 8px 0; font-size:22px; color:#111827;">Reservation Approved</h1>
            <p style="margin:0 0 12px 0; color:#374151;">Hi {{userName}},</p>
            <p style="margin:0 0 12px 0; color:#374151;">
              Good news — your reservation at <strong>{{hotelName}}</strong> (ID: <strong>{{reservationId}}</strong>) has been <strong>approved</strong>! We look forward to hosting you.
            </p>
            <table role="table" aria-label="Reservation details" style="width:100%; border-collapse:collapse; margin:12px 0 16px 0;">
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151; width:40%;"><strong>Check-in</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">{{checkInDate}}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;"><strong>Check-out</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">{{checkOutDate}}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;"><strong>Guests</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">{{guests}}</td>
              </tr>
              <tr>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;"><strong>Total</strong></td>
                <td style="padding:8px 6px; border:1px solid #e6e9ef; font-size:14px; color:#374151;">{{totalPrice}}</td>
              </tr>
            </table>
            <div style="text-align:center; padding:18px 0 0 0;">
              <a href="{{detailsLink}}" target="_blank" rel="noopener noreferrer" style="display:inline-block; text-decoration:none; padding:12px 20px; border-radius:6px; background-color:#ff6300; color:#ffffff; font-weight:600;">View reservation details</a>
            </div>
            <p style="margin:16px 0 0 0; color:#6b7280; font-size:13px;">
              If you need to modify or cancel your booking, contact us at <a href="mailto:{{supportEmail}}" style="color:#6b7280; text-decoration:underline;">{{supportEmail}}</a>.
            </p>
            <p style="margin:12px 0 0 0; color:#6b7280; font-size:13px;">
              We look forward to welcoming you — safe travels!
            </p>
          </div>
          <div style="background:#f9fafb; padding:12px 20px; font-size:12px; color:#9ca3af; text-align:center;">
            <div style="margin-bottom:6px;">© {{companyName}} • All rights reserved</div>
            <div style="font-size:11px;">Manage your notifications in your account settings.</div>
          </div>
        </div>
      </div>
      `,
    });

    return reservation;
  }
}
