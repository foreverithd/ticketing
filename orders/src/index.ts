import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-update-listener';

import { app } from './app';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined!');
  }

  console.log('Starting Mongo DB');
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      connectTimeoutMS: 30000,
      keepAlive: true,
    });
    console.log('Connected to Mongo DB');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Order service is listening on 3000');
  });
};

start();
