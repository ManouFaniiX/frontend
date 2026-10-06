import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ConfigModule } from '@nestjs/config';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { LocalProvider } from './providers/local.provider';

// DÉCOMMENTER POUR UTILISER CLOUDINARY
// import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  imports: [MulterModule.register({ storage: memoryStorage() }), ConfigModule],
  controllers: [StorageController],
  providers: [
    StorageService,
    LocalProvider,
    // DÉCOMMENTER POUR UTILISER CLOUDINARY
    // CloudinaryProvider,
  ],
  exports: [StorageService],
})
export class StorageModule {}
