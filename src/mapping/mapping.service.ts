import { Injectable } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class MappingService {

  async findMapping(db: Db, collectionName: string, mapping: Record<string, any>) {
    const collection = db.collection(collectionName);
    // Check if mapping object exists (exact match)
    const existing = await collection.findOne({ mapping });
    return existing;
  }

  async saveMapping(db: Db, collectionName: string, mapping: Record<string, any>) {
    const collection = db.collection(collectionName);
    await collection.insertOne({ mapping });
  }
}
