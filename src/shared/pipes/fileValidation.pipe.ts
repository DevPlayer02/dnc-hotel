import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { fileTypeFromBuffer } from 'file-type';
import { promises as fs } from 'fs';

@Injectable()
export class FileUploadPipe implements PipeTransform<Express.Multer.File> {
  private maxSize = 900 * 1024;
  private allowedMimes = ['image/jpeg', 'image/png'];

  async transform(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No files were uploaded.');

    if (file.size > this.maxSize) {
      await this.removeInvalid(file.path);
      throw new BadRequestException(
        `File too large! Maximum allowed: ${(this.maxSize / 1024).toFixed(0)} KB.`,
      );
    }

    let buffer: Buffer | null = null;

    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      try {
        buffer = await fs.readFile(file.path);
      } catch {
        throw new BadRequestException('Failed to read file for validation.');
      }
    } else {
      throw new BadRequestException('No valid file data.');
    }

    const type = await fileTypeFromBuffer(buffer);
    if (!type || !this.allowedMimes.includes(type.mime)) {
      await this.removeInvalid(file.path);
      throw new BadRequestException(
        'Invalid type! Only JPEG or PNG are allowed.',
      );
    }

    return file;
  }

  private async removeInvalid(path: string) {
    try {
      await fs.unlink(path);
    } catch {
      throw new BadRequestException('Invalid remove.');
    }
  }
}
