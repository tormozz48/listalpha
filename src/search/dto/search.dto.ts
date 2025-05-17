import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';

export class SearchBodyDto {
  @IsNotEmpty({ message: 'Search value is required' })
  @IsString({ message: 'Search value must be a string' })
  @MaxLength(100, { message: 'Search value cannot exceed 100 characters' })
  @Transform(({ value }) => value.trim())
  searchValue: string;
}

@Exclude()
export class CompetitorDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  get description() {
    return this.short_description;
  }

  @Expose()
  get logo() {
    return this.logo_url;
  }

  @Expose()
  get website() {
    return this.website_url;
  }

  readonly short_description: string;

  readonly logo_url: string;

  readonly website_url: string;
}

export class SearchResponseDto {
  @Type(() => CompetitorDto)
  readonly competitors: CompetitorDto[];
}
