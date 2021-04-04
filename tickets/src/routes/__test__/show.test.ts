import request from 'supertest';
import mongoose, { mongo } from 'mongoose';

import { app } from '../../app';

it('should return 404 if ticket not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const price = 20;
  const title = 'hello';
  // add in a check to make sure a ticket was saved
  const tktCreation = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({
      title,
      price,
    })
    .expect(201);

  const tktRes = await request(app)
    .get(`/api/tickets/${tktCreation.body.id}`)
    .send()
    .expect(200);

  expect(tktRes.body.title).toEqual(title);
  expect(tktRes.body.price).toEqual(price);
});
