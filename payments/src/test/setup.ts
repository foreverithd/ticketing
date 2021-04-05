import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
    }
  }
}

let mongo: any;
jest.mock('../nats-wrapper');

beforeAll(async () => {
  jest.clearAllMocks();
  process.env.JWT_KEY = 'cheeti';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    connectTimeoutMS: 30000,
    keepAlive: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  // build a JWT payload. { id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'hello@gmail.com',
  };

  // creat a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build a session obje {jwt: jwtcode}
  const session = { jwt: token };

  // turn that session into json
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base65
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  const cookie = [`express:sess=${base64}`];

  return cookie;
};
