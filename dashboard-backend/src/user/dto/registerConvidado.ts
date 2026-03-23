import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterConvidadoDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

}
