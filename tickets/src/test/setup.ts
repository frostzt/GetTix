import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  function signIn(): string[];
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

global.signIn = () => {
  const payload = {
    id: "1234hiioa9",
    email: "test@test.com",
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const encodedSession = Buffer.from(sessionJSON).toString("base64");

  return [`session=${encodedSession}`];
};
