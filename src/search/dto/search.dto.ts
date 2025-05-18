import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchBodyDto {
  @IsNotEmpty({ message: 'Search value is required' })
  @IsString({ message: 'Search value must be a string' })
  @MaxLength(100, { message: 'Search value cannot exceed 100 characters' })
  @Matches(/^(?!www\.|@)([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/, {
    message:
      'Search value must be a valid domain name (e.g., example.com) without www, @ or other URL parts',
  })
  @Transform(({ value }) => {
    value = value.trim().toLowerCase();
    value = value.replace(/^(https?:\/\/)?(www\.)?/i, '');
    value = value.split('/')[0].split('?')[0].split('#')[0];
    return value;
  })
  searchValue: string;
}

export class CompetitorDto {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly website: string;
}

export class SearchResponseDto {
  @Type(() => CompetitorDto)
  readonly competitors: CompetitorDto[];
}
