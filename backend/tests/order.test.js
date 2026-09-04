const request = require("supertest");
const app = require("../src/app");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Why in-memory Mongo, not your real dev DB: tests need a clean,
// disposable database every run.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

test("cannot place an order with an empty cart", async () => {
  const res = await request(app).post("/api/orders").set("Authorization", `Bearer ${testUserToken}`).send({ addressId: "x", paymentMethod: "cod" });
  expect(res.status).toBe(400);
});

test("cannot cancel an order that's already accepted", async () => {
  // create an order, set status to "accepted", then attempt cancel
  const res = await request(app).post(`/api/orders/${order._id}/cancel`).set("Authorization", `Bearer ${testUserToken}`);
  expect(res.status).toBe(400);
});