import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";

describe("Update route", () => {
  it("returns a 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${id}`)
      .set("Cookie", global.signIn())
      .send({ title: "A valid title", price: 50 })
      .expect(404);
  });

  it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`/api/tickets/${id}`)
      .send({ title: "A valid title", price: 50 })
      .expect(401);
  });

  it("returns a 401 if the user does not owns the ticket", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send({ title: "A Piano concert", price: 50 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", global.signIn())
      .send({ title: "Changed Title", price: 1000 })
      .expect(401);
  });

  it("returns a 400 if the provided title and price are invalid", async () => {
    const cookie = global.signIn();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "A Piano concert", price: 50 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "", price: 20 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({ title: "A valid title", price: -50 })
      .expect(400);
  });

  it("updates the ticket if valid inputs are provided", async () => {
    const title = "Updated title";
    const price = 5000;

    const cookie = global.signIn();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "A Piano concert", price: 50 });

    const updatedResponse = await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title,
        price,
      })
      .expect(200);

    const fetchResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send();

    expect(updatedResponse.body.title).toEqual(title);
    expect(updatedResponse.body.price).toEqual(price);
    expect(fetchResponse.body.price).toEqual(price);
    expect(fetchResponse.body.price).toEqual(price);
  });
});
