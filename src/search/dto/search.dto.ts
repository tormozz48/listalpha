import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchBodyDto {
  @ApiProperty({
    description: 'Domain name to search for competitors',
    example: 'example.com',
    maxLength: 100,
    pattern: '^(?!www.|@)([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?.)+[a-zA-Z]{2,}$',
  })
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
  @ApiProperty({
    description: 'Unique identifier of the competitor',
    example: 'comp-123',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Name of the competitor company',
    example: 'Acme Corporation',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Brief description of the competitor',
    example: 'A leading provider of innovative solutions',
  })
  readonly description: string;

  @ApiProperty({
    description: 'URL to the competitor company logo',
    example: 'https://example.com/logo.png',
  })
  readonly logo: string;

  @ApiProperty({
    description: 'Website URL of the competitor',
    example: 'https://example.com',
  })
  readonly website: string;
}

export class SearchResponseDto {
  @ApiProperty({
    description: 'List of competitor companies',
    type: [CompetitorDto],
  })
  @Type(() => CompetitorDto)
  readonly competitors: CompetitorDto[];
}
