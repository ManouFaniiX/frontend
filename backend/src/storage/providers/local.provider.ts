import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { extname, join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import {
  StorageProvider,
  UploadResult,
} from '../interfaces/storage-provider.interface';
import { UploadedFile } from '../interfaces/file.interface';

@Injectable()
export class LocalProvider implements StorageProvider {
  private readonly uploadDir: string;

  constructor(configService: ConfigService) {
    this.uploadDir = configService.get<string>('UPLOAD_DIR') ?? './uploads';
  }

  async upload(file: UploadedFile, folder?: string): Promise<UploadResult> {
    const targetDir = folder ? join(this.uploadDir, folder) : this.uploadDir;

    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    const ext = extname(file.originalname);
    const filename = `${randomBytes(16).toString('hex')}${ext}`;
    const filepath = join(targetDir, filename);

    await writeFile(filepath, file.buffer);

    const urlPath = folder ? `/${folder}/${filename}` : `/${filename}`;

    return { url: urlPath };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async delete(_publicId: string): Promise<void> {
    // Not implemented for local storage
  }
}
