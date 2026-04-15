import { IsArray, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateSnippetDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsArray()
  tags!: string[];

  @IsEnum(['link', 'note', 'command'])
  type!: 'link' | 'note' | 'command';
}
