import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined!');
    }

    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined!');
    }

    console.log('Starting Mongo DB');
    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Connected to Mongo DB');
    } catch (err) {
        console.log(err);
    }

    app.listen(3000, () => {
        console.log('Ticket service is listening on 3000');
    });
}

start();