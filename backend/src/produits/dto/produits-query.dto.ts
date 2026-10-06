import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsInt,
  IsArray,
  ArrayUnique,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class ProduitsQueryDto extends PaginationQueryDto {
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

  @ApiPropertyOptional({ description: 'Produits d’une catégorie' })
  @IsOptional()
  @IsUUID()
  categorieId?: string;

  @ApiPropertyOptional({
    description: 'Produits fournis par ces fournisseurs (IDs)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  fournisseurIds?: string[];

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prixMin?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prixMax?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockMin?: number;
}