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
import { FournisseursService } from './fournisseurs.service';
import { CreateFournisseurDto } from './dto/create-fournisseur.dto';
import { FournisseursQueryDto } from './dto/fournisseurs-query.dto';

@ApiBearerAuth()
@ApiTags('Fournisseurs')
@Controller('fournisseurs')
export class FournisseursController {
  constructor(private readonly service: FournisseursService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un fournisseur' })
  create(@Body() dto: CreateFournisseurDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les fournisseurs (filtres: search, nom, email, telephone)' })
  findAll(@Query() query: FournisseursQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un fournisseur par id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un fournisseur' })
  update(@Param('id') id: string, @Body() dto: CreateFournisseurDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un fournisseur' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}