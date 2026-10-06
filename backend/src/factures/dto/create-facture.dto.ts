import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFactureDto {
  @ApiPropertyOptional({ description: 'Généré automatiquement si absent' })
  @IsOptional()
  @IsString()
  numeroFacture?: string;

  @ApiProperty({ description: 'ID du client' })
  @IsUUID()
  clientId: string;

  @ApiProperty({ minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  montantTotal: number;

  @ApiPropertyOptional({ enum: ['en_attente', 'payee', 'annulee'], default: 'en_attente' })
  @IsOptional()
  @IsIn(['en_attente', 'payee', 'annulee'])
  statut?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateFacture?: Date;
}