import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { InventoryDestinationDto } from './dto/inventory-destination.dto';
import { MappingService } from 'src/mapping/mapping.service';
import { randomUUID } from 'crypto';

@Injectable()
export class InventoryDestinationService {
  constructor(private readonly mappingService: MappingService) {}

  private readonly BATCH_SIZE = 500;

  // ------------------------------- SAVE DATA -------------------------------
  async saveData(dto: InventoryDestinationDto): Promise<any> {
    const { url, inventoryCollection, mappingCollection, data, mapping } = dto;

    if (!url || !inventoryCollection || !mappingCollection || !data?.length) {
      return { success: false, message: 'Missing required fields or invalid data' };
    }

    const client = new MongoClient(url);
    const uploadRunId = randomUUID();
    const createdAt = new Date();
    let insertedCount = 0;
    let failedCount = 0;
    const failedRows: any[] = [];
    let mappingStatus = '';

    try {
      await client.connect();
      const dbName = this.extractDBName(url);
      const db = client.db(dbName);

      // Check and save mapping
      const existingMapping = await this.mappingService.findMapping(db, mappingCollection, mapping);
      mappingStatus = existingMapping ? 'exists' : 'created';
      if (!existingMapping) await this.mappingService.saveMapping(db, mappingCollection, mapping);

      const collection = db.collection(inventoryCollection);
      const batchResults: string[] = [];

      for (let i = 0; i < data.length; i += this.BATCH_SIZE) {
        const batch = data.slice(i, i + this.BATCH_SIZE).map(row => ({ ...row, uploadRunId }));

        try {
          const res = await collection.insertMany(batch, { ordered: false });
          insertedCount += res.insertedCount;

          // MongoDB doesn't return which specific rows failed, so here we assume all uninserted are failed
          const failedInBatch = batch.filter((_, idx) => !res.insertedIds[idx]);
          failedCount += failedInBatch.length;
          failedRows.push(...failedInBatch);

          batchResults.push(
            `Batch ${Math.floor(i / this.BATCH_SIZE) + 1}: ✅ Inserted ${res.insertedCount}, ❌ Failed ${failedInBatch.length}`
          );
        } catch (err: any) {
          failedCount += batch.length;
          failedRows.push(...batch);
          batchResults.push(
            `Batch ${Math.floor(i / this.BATCH_SIZE) + 1}: ❌ Failed all ${batch.length} rows - ${err?.message || err}`
          );
        }
      }

      // Store upload summary in the same DB
      await db.collection('upload_history').insertOne({
        uploadRunId,
        sheetName: mapping.sheetName,
        totalRows: data.length,
        totalInserted: insertedCount,
        totalFailed: failedCount,
        mappingStatus,
        batchResults,
        createdAt,
      });

      return {
        success: true,
        uploadRunId,
        insertedCount,
        failedCount,
        failedRows,
        mappingExists: existingMapping,
        batchResults,
        message: `Inventory saved. Mapping ${mappingStatus}. Inserted ${insertedCount}, Failed ${failedCount}.`
      };
    } catch (err: any) {
      return { success: false, message: err.message };
    } finally {
      await client.close();
    }
  }

  // ------------------------------- GET HISTORY -------------------------------
  async getHistory(url: string, limit = 10) {
    const client = new MongoClient(url);
    await client.connect();
    const dbName = this.extractDBName(url);
    const db = client.db(dbName);

    try {
      const collection = db.collection('upload_history');
      return await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .toArray();
    } finally {
      await client.close();
    }
  }

  // ------------------------------- GET DATA -------------------------------
  async getData(url: string, inventoryCollection: string, uploadRunId: string) {
    if (!url || !inventoryCollection || !uploadRunId) 
      throw new Error('Missing required fields');

    const client = new MongoClient(url);
    try {
      await client.connect();
      const dbName = this.extractDBName(url);
      const db = client.db(dbName);

      const data = await db.collection(inventoryCollection).find({ uploadRunId }).toArray();
      return data;
    } finally {
      await client.close();
    }
  }

  // ------------------------------- GET MAPPING -------------------------------
  async getMapping(url: string, mappingCollection: string, sheetName: string) {
    if (!url || !mappingCollection || !sheetName)
      throw new Error('Missing required fields');

    const client = new MongoClient(url);
    try {
      await client.connect();
      const dbName = this.extractDBName(url);
      const db = client.db(dbName);

      const doc = await db.collection(mappingCollection).findOne({ sheetName });
      return doc?.columns || [];
    } finally {
      await client.close();
    }
  }

  // ------------------------------- HELPER -------------------------------
  private extractDBName(url: string): string {
    const regex = /mongodb(?:\+srv)?:\/\/[^\/]+\/([^?]+)?/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : 'test';
  }
}
