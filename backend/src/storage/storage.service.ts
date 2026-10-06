import { Injectable } from '@nestjs/common';
import {
  StorageProvider,
  UploadResult,
} from './interfaces/storage-provider.interface';
import { LocalProvider } from './providers/local.provider';
import { UploadedFile } from './interfaces/file.interface';

@Injectable()
export class StorageService {
  private provider: StorageProvider;

  constructor(localProvider: LocalProvider) {
    this.provider = localProvider;
  }

  // DÉCOMMENTER POUR UTILISER CLOUDINARY
  // setProvider(provider: StorageProvider) {
  //   this.provider = provider;
  // }

  async upload(file: UploadedFile, folder?: string): Promise<UploadResult> {
    return this.provider.upload(file, folder);
  }

  async delete(publicId: string): Promise<void> {
    return this.provider.delete(publicId);
  }
}
