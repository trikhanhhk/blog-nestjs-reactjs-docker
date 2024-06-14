import { Injectable } from '@nestjs/common';
import * as AWS from "aws-sdk";

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.MINIO_BUCKET_NAME;
  s3 = new AWS.S3
    ({
      accessKeyId: 'Mwd1Gh1N6fKYg7Gik4km',
      secretAccessKey: 'tFKX44YBpDqCiZ3SxSu8Lkr5Z8u9wdZwPGrKscYG',
      endpoint: "http://minio:9000",
      s3ForcePathStyle: true,
      sslEnabled: false,
    });

  constructor() {
    this.s3 = new AWS.S3
      ({
        accessKeyId: 'Mwd1Gh1N6fKYg7Gik4km',
        secretAccessKey: 'tFKX44YBpDqCiZ3SxSu8Lkr5Z8u9wdZwPGrKscYG',
        endpoint: "http://minio:9000",
        s3ForcePathStyle: true,
        sslEnabled: false,
      });
  }


  async uploadFile(file): Promise<string> {
    const originalname = Date.now() + '-' + file.originalname
    const result = await this.s3_upload(file.buffer, this.AWS_S3_BUCKET, originalname, file.mimetype);
    return `${(result as any).Bucket}/${(result as any).key}`;
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params =
    {
      Bucket: "viblo-bucket",
      Key: String(name),
      Body: file,
      ACL: "public-read",
      ContentType: mimetype,
      ContentDisposition: "inline",
    };

    console.log(params);

    try {
      let s3Response = await this.s3.upload(params).promise();
      return s3Response;
    }
    catch (e) {
      console.log(e);
    }
  }
}
