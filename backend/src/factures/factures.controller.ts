import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FacturesService } from './factures.service';
import { CreateFactureDto } from './dto/create-facture.dto';
import { FacturesQueryDto } from './dto/factures-query.dto';

@ApiBearerAuth()
@ApiTags('Factures')
@Controller('factures')
export class FacturesController {
  constructor(private readonly service: FacturesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une facture' })
  create(@Body() dto: CreateFactureDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les factures (filtres: search, numeroFacture, statut, clientId)' })
  findAll(@Query() query: FacturesQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une facture par id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une facture' })
  update(@Param('id') id: string, @Body() dto: CreateFactureDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une facture' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}