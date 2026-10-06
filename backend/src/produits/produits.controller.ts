import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { ProduitsQueryDto } from './dto/produits-query.dto';
import { StorageService } from '../storage/storage.service';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiBearerAuth()
@ApiTags('Produits')
@Controller('produits')
export class ProduitsController {
  constructor(
    private readonly service: ProduitsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un produit' })
  create(@Body() dto: CreateProduitDto) {
    return this.service.create(dto);
  }

  @Post(':id/images')
  @ApiOperation({ summary: 'Uploader les images du produit' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp|svg)$/ }),
        ],
      }),
    )
    files: MulterFile[],
  ) {
    const uploaded = await Promise.all(
      files.map((file) => this.storageService.upload(file, 'produits')),
    );
    return this.service.addImages(
      id,
      uploaded.map((result) => result.url),
    );
  }

  @Delete(':id/images/:imageId')
  @ApiOperation({ summary: 'Supprimer une image du produit' })
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.service.removeImage(id, imageId);
  }

  @Get()
  @ApiOperation({
    summary:
      'Lister les produits (filtres: search, nom, code, categorieId, fournisseurIds, prixMin, prixMax, stockMin)',
  })
  findAll(@Query() query: ProduitsQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un produit par id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un produit' })
  update(@Param('id') id: string, @Body() dto: CreateProduitDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un produit' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}