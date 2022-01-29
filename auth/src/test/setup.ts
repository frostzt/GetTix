import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signIn(): Promise<string[]>;
    }
  }
}

// Create a new In-Memory Mongo Instance
let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "this-is-a-test-secret-key";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

// Reset MongoDB Collections before each new test
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// Cleanup
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
}, 10000);

// @ts-expect-error for some reason it does not detect the change
global.signIn = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);
  const cookie = response.get("Set-Cookie");

  return cookie;
};
