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
import { CategoriesService } from './categories.service';
import { CreateCategorieDto } from './dto/create-categorie.dto';
import { CategoriesQueryDto } from './dto/categories-query.dto';

@ApiBearerAuth()
@ApiTags('Catégories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une catégorie' })
  create(@Body() dto: CreateCategorieDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les catégories (filtres: search, nom, code, parentId)' })
  findAll(@Query() query: CategoriesQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une catégorie par id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une catégorie' })
  update(@Param('id') id: string, @Body() dto: CreateCategorieDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}