import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

describe("Tickets routes", () => {
  it("has a route for handeling /api/tickets for post requests", async () => {
    const response = await request(app).post("/api/tickets").send({});
    expect(response.status).not.toEqual(404);
  });

  it("can only be accessed if the user is logged in", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });

  it("returns a status other than 401 if the user is signed in", async () => {
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it("returns an error if invalid title is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send({ title: "", price: 10 })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send({ price: 10 })
      .expect(400);
  });

  it("returns an error if invalid price is provided", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send({ title: "A valid title", price: -10 })
      .expect(400);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send({ title: "A valid title" })
      .expect(400);
  });

  it("creates a ticket with valid params", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signIn())
      .send({ title: "A Valid Title", price: 20 })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
  });
});
