import { IsOptional, IsString, MaxLength, IsIn, IsDateString, IsUrl } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fullname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  phoneCode?: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  defaultAddress?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}