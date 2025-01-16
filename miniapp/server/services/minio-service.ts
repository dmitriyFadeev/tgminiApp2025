import * as Minio from 'minio';

import { env } from '../../../env';
import type { TMinioUpload } from '../dtos/minio';

class MinioClient {
  static minioClient = new Minio.Client({
    endPoint: env.MINIOENDPOINT,
    port: env.MINIOPORT,
    useSSL: env.MINIOUSESSL,
    accessKey: env.MINIOACCESSKEY,
    secretKey: env.MINIOSECRETKEY,
  });

  static async uploadFile(
    fileName: string,
    fileBuffer: Buffer,
    bucketName: string
  ): Promise<TMinioUpload> {
    try {
      const exists = await this.minioClient.bucketExists(bucketName);
      if (!exists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }
      console.log('putting');
      await this.minioClient.putObject(bucketName, fileName, fileBuffer);
      console.log(
        `File '${fileName}' uploaded successfully to bucket '${bucketName}'.`
      );
      return {
        fileName,
        bucketName,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Could not upload file');
    }
  }

  static async getObjectFromMinIO(
    filePath: string,
    bucketName: string
  ): Promise<Buffer> {
    try {
      const stream = await this.minioClient.getObject(bucketName, filePath);
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks.map((chunk) => Uint8Array.from(chunk)));
    } catch (error) {
      console.error('Error retrieving file from MinIO:', error);
      throw new Error('Could not retrieve file');
    }
  }
}

export default MinioClient;
