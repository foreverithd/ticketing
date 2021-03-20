import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

it("returns 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = "concert";
  const price = "20";

  await request(app)
    .put("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title,
      price,
      userId: id,
    })
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const title = "concert";
  const price = "20";

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title,
      price,
    })
    .expect(401);
});

it("returns 401 if the user does not own the ticket", async () => {
  const title = "concert";
  const price = "20";

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signup())
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signup())
    .send({
      title,
      price,
    })
    .expect(401);
});

it("returns 400 if the user provides invalid title or price", async () => {
  const title = "concert";
  const price = "20";
  const cookie = global.signup();

  const res = await request(app)
    .put("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title,
      price: -19,
    })
    .expect(400);
});

it("updates the ticket provided with valid input", async () => {
  const title = "concert";
  const price = "20";
  const cookie = global.signup();

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title,
      price,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new concert",
      price: 100,
    })
    .expect(200);

  const ticketRes = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketRes.body.title).toEqual("new concert");
  expect(ticketRes.body.price).toEqual("100");
});

it("", async () => {});
