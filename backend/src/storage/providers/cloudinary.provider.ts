// DÉCOMMENTER POUR UTILISER CLOUDINARY
// npm install cloudinary
//
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { v2 as cloudinary } from 'cloudinary';
// import { StorageProvider, UploadResult } from '../interfaces/storage-provider.interface';
// import { UploadedFile } from '../interfaces/file.interface';
//
// @Injectable()
// export class CloudinaryProvider implements StorageProvider {
//   constructor(configService: ConfigService) {
//     cloudinary.config({
//       cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
//       api_key: configService.get<string>('CLOUDINARY_API_KEY'),
//       api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
//     });
//   }
//
//   async upload(file: UploadedFile, folder?: string): Promise<UploadResult> {
//     return new Promise((resolve, reject) => {
//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: folder ?? 'uploads',
//           resource_type: 'auto',
//         },
//         (error, result) => {
//           if (error) return reject(error);
//           resolve({
//             url: result!.secure_url,
//             publicId: result!.public_id,
//           });
//         },
//       );
//       uploadStream.end(file.buffer);
//     });
//   }
//
//   async delete(publicId: string): Promise<void> {
//     await cloudinary.uploader.destroy(publicId);
//   }
// }
