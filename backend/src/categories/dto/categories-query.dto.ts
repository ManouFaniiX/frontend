import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class CategoriesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Recherche par nom ou code' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Catégories filles d’une catégorie parente' })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}