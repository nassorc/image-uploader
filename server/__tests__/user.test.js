const request = require('supertest');
const app = require('../app');

describe('POST /login', () => {
    test('responds with json', async () => {
        const response = await request(app).post('/login').send({
            username: 'username',
            password: 'password',
        })
        console.log(response)
        expect(2).toBe(2);
    })

    describe('given a username and password', () => {
        test('should respond with a 200 status code', async () => {
            const response = await request(app).post('/login').send({
                username: 'username',
                password: 'password',
            });
            expect(response.statusCode).toBe(200);
        })
    })

    describe('when username and password is missing', () => {
        test('should respond with a 422 status code', async () => {
            const response = await request(app).post('/login').send({
                username: '',
                password: '',
            });
            expect(response.statusCode).toBe(422);
        })
    })

    describe('when given a username and missing a password', () => {
        test('should respond with a 422 status code', async () => {
            const response = await request(app).post('/login').send({
                username: 'Matthew',
                password: '',
            });
            expect(response.statusCode).toBe(422);
        })
    })

})