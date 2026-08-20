import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-zA-Z])(?=.*\d)/, {
    message: 'password debe contener al menos una letra y un número.',
  })
  password: string;
}
