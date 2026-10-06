import { IsOptional, IsString, IsUUID, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

export class FacturesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Recherche par numéro de facture' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numeroFacture?: string;

  @ApiPropertyOptional({ enum: ['en_attente', 'payee', 'annulee'] })
  @IsOptional()
  @IsIn(['en_attente', 'payee', 'annulee'])
  statut?: string;

  @ApiPropertyOptional({ description: 'Factures d’un client' })
  @IsOptional()
  @IsUUID()
  clientId?: string;
}