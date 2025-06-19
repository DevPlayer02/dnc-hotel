import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthForgotPasswordDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
