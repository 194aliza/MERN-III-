import path from 'path';
import dotenv from 'dotenv';
import mongoose, { connect, disconnect } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
(process.env as any).NODE_ENV = process.env.NODE_ENV ?? 'test';
(process.env as any).JWT_SECRET = process.env.JWT_SECRET ?? 'test-secret';
(process.env as any).MONGOMS_VERSION = process.env.MONGOMS_VERSION ?? '5.0.13';

beforeAll(async () => {
  const memoryServerBinaryVersion = process.env.MONGOMS_VERSION as string;

  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: memoryServerBinaryVersion,
    },
  });

  const mongoUri = mongoServer.getUri();
  await connect(mongoUri);
});

afterAll(async () => {
  await disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  const collections = await mongoose.connection.db?.collections();
  if (collections) {
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});
