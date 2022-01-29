import request from "supertest";
import { app } from "../../app";

describe("Signin route", () => {
  it("fails when an email that does not exist is supplied", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(400);
  });

  it("fails when an incorrect password is supplied", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);

    await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "asdfasdf" })
      .expect(400);
  });

  it("responds with cookie when given with valid creds", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({ email: "test@test.com", password: "password" })
      .expect(201);

    const response = await request(app)
      .post("/api/users/signin")
      .send({ email: "test@test.com", password: "password" })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
