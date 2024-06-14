import { IsOptional, IsString } from 'class-validator'

export class CreateArticleDto {
  @IsString()
  readonly title: string

  @IsString()
  readonly description: string

  @IsString()
  readonly keyword: string

  @IsString()
  readonly body: string

  @IsString()
  readonly tag?: string
}
