import { IsString, IsOptional, IsEnum } from 'class-validator';
import { FeedType } from '../../entities/feed.entity';

export class CreateFeedDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  content_img?: string; // base64 encoded

  @IsEnum(FeedType)
  @IsOptional()
  feed_type?: FeedType;
}

