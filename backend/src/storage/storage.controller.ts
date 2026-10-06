import {
  Controller,
  Post,
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
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { Public } from '../common/decorators/public.decorator';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiBearerAuth()
@ApiTags('Uploads')
@Controller('uploads')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Upload a file' })
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
  async upload(
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
    const { buffer, originalname, mimetype, size } = file;
    return this.storageService.upload(
      {
        buffer,
        originalname,
        mimetype,
        size,
        fieldname: 'file',
        encoding: '7bit',
      },
      'images',
    );
  }
}
