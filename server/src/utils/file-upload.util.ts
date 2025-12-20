import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

export class FileUploadUtil {
  static async uploadToCloudinary(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  static async uploadMultipleToCloudinary(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<string[]> {
    const uploadPromises = files.map((file) =>
      this.uploadToCloudinary(file, folder),
    );
    return Promise.all(uploadPromises);
  }

  static async deleteFromCloudinary(url: string): Promise<void> {
    const publicId = this.extractPublicId(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  private static extractPublicId(url: string): string | null {
    const matches = url.match(/\/v\d+\/(.+)\./);
    return matches ? matches[1] : null;
  }
}
