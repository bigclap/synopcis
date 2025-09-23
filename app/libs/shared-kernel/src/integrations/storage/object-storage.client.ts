import { Injectable } from '@nestjs/common';

export interface StoredObject {
  readonly bucket: string;
  readonly key: string;
  readonly contentType: string;
  readonly body: Buffer;
  readonly metadata?: Record<string, string>;
}

@Injectable()
export class InMemoryObjectStorageClient {
  private readonly objects = new Map<string, StoredObject>();

  async putObject(object: StoredObject): Promise<void> {
    this.objects.set(this.getKey(object.bucket, object.key), object);
  }

  async getObject(
    bucket: string,
    key: string,
  ): Promise<StoredObject | undefined> {
    return this.objects.get(this.getKey(bucket, key));
  }

  async removeObject(bucket: string, key: string): Promise<void> {
    this.objects.delete(this.getKey(bucket, key));
  }

  private getKey(bucket: string, key: string): string {
    return `${bucket}:${key}`;
  }
}
