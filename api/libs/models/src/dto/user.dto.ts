import { IsNotEmpty, IsJWT } from 'class-validator';

export class GoogleLoginDto {
  @IsJWT()
  @IsNotEmpty()
  idToken!: string;
}
