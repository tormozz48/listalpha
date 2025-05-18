import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchBodyDto {
  @IsNotEmpty({ message: 'Search value is required' })
  @IsString({ message: 'Search value must be a string' })
  @MaxLength(100, { message: 'Search value cannot exceed 100 characters' })
  @Transform(({ value }) => value.trim())
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
