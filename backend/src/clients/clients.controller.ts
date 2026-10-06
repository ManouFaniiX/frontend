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
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsQueryDto } from './dto/clients-query.dto';
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
@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly service: ClientsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Créer un client' })
  create(@Body() dto: CreateClientDto) {
    return this.service.create(dto);
  }

  @Post(':id/image')
  @ApiOperation({ summary: "Uploader l'image du client" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp|svg)$/ }),
        ],
      }),
    )
    file: MulterFile,
  ) {
    const result = await this.storageService.upload(file, 'clients');
    return this.service.updateImage(id, result.url);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les clients (filtres: search, nom, email, telephone)' })
  findAll(@Query() query: ClientsQueryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un client par id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un client' })
  update(@Param('id') id: string, @Body() dto: CreateClientDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un client' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}