import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

interface SigninOptions {
  isAdmin?: boolean
}

declare global {
  namespace NodeJS {
    interface Global {
      signin: (options?: SigninOptions) => string[],
      signinAsGuest: () => string[]
    }
  }
}

interface SigninOptions {
  id?: string;
  isAdmin?: boolean
}

global.signin = (options: SigninOptions = {}) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: options?.id || mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    isAdmin: !!options?.isAdmin,
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: jwt_data }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessonJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessonJSON).toString('base64');

  // return a string thats the cookie with the encode data

  return [`shop=${base64}`]
};

global.signinAsGuest = () => {
  // Build session Object. { jwt: jwt_data }
  const session = { guestId: "test-guestId" };

  // Turn that session into JSON
  const sessonJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessonJSON).toString('base64');

  // return a string thats the cookie with the encode data

  return [`shop=${base64}`]
};

jest.mock('../nats-wrapper');

let mongo: MongoMemoryServer;

beforeAll(async () => {
  // Setup ENV variables
  process.env.JWT_KEY = 'test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
