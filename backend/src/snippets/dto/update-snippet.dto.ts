import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateSnippetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsEnum(['link', 'note', 'command'])
  type?: 'link' | 'note' | 'command';
}
