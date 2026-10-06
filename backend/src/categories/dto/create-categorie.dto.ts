import { IsString, IsOptional, IsUUID, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategorieDto {
  @ApiProperty({ description: 'Acronyme ou code de la catégorie' })
  @IsString()
  @Length(2, 20)
  code: string;

  @ApiProperty()
  @IsString()
  nom: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'ID de la catégorie parente (sous-catégorie)' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}