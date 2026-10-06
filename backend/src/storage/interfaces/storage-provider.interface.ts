import { UploadedFile } from './file.interface';

export interface UploadResult {
  url: string;
  publicId?: string;
}

export interface StorageProvider {
  upload(file: UploadedFile, folder?: string): Promise<UploadResult>;
  delete(publicId: string): Promise<void>;
}
