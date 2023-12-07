import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class createUserDto {
  @IsNotEmpty({ message: 'Name should be not empty' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Email should be not empty' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password should be not empty' })
  @IsAlphanumeric()
  @Length(6, 8)
  password: string;
}
