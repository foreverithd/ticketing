import request from 'supertest';
import { app } from '../../app';

it('failes when an email that does not exist is supplied', async () => {
    return request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'hello'
        })
        .expect(400);
});


it('failes when incorrect password is supplied', async () => {

    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'hello'
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'hell'
        })
        .expect(400);
});


it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'hello'
        })
        .expect(201);

    const res = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'hello'
        })
        .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
});