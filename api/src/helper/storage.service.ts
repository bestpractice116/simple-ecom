import type { S3Client as S3ClientType } from "@aws-sdk/client-s3";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ErrorDto } from "../types/error.dto";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";

@Injectable()
export class StorageService {
  private s3Client: S3ClientType;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get("CLOUDFLARE_R2_REGION"),
      endpoint: configService.get("CLOUDFLARE_R2_ENDPOINT"),
      credentials: {
        accessKeyId: configService.get("CLOUDFLARE_R2_ACCESS_KEY"),
        secretAccessKey: configService.get("CLOUDFLARE_R2_SECRET_KEY")
      }
    });
  }

  async uploadString(filename: string, data: string, type: string): Promise<[string | null, ErrorDto]> {
    try {
      const param = {
        Bucket: this.configService.get("CLOUDFLARE_R2_BUCKET"),
        Key: `SEC/${filename}`,
        Body: data,
        ContentType: type
      };
      await this.s3Client.send(new PutObjectCommand(param));
      return [`${this.configService.get("CLOUDFLARE_R2_PUBLIC_DOMAIN")}/${filename}`, null];
    } catch (error) {
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }

  async uploadFile(filename: string, data: Express.Multer.File): Promise<[string | null, ErrorDto]> {
    try {
      const randomKey = randomStringGenerator();
      const project = this.configService.get("CLOUDFLARE_R2_PROJECT");
      const param = {
        Bucket: this.configService.get("CLOUDFLARE_R2_BUCKET"),
        Key: `${project}/${randomKey}`,
        Body: data.buffer
      };

      await this.s3Client.send(new PutObjectCommand(param));
      return [`${this.configService.get("CLOUDFLARE_R2_PUBLIC_DOMAIN")}/${project}/${randomKey}`, null];
    } catch (error) {
      return [null, { message: "Internal Server Error", status: 500 }];
    }
  }

  async deleteFile(url: string): Promise<ErrorDto> {
    try {
      const filename = url.split("/").slice(-1)[0];
      const param = {
        Bucket: this.configService.get("CLOUDFLARE_R2_BUCKET"),
        Key: filename
      };

      await this.s3Client.send(new DeleteObjectCommand(param));
      return null;
    } catch (error) {
      return { message: "Internal Server Error", status: 500 };
    }
  }
}