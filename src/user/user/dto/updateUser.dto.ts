import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class updateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString()
  firstName: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email is not valid value' })
  email: string;

  @IsOptional()
  @IsAlphanumeric()
  @Length(6, 8)
  password?: string;
}
