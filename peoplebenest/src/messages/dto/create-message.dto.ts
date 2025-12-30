import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  receiver_id: number;

  @IsString()
  message: string;
}

