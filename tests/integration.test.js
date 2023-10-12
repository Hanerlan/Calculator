/* 
Here we will test all operations based on the previous result, only available for authenticated users

First, we log in to the application and assign a generated token to the variable
Then, make the request to the /add endpoint to make sure the previous value is set (remember to set the correct authorization header)
Finally, call the /previous/add/1 endpoint to increment the previous value by 1
*/

const express = require('express'); 
const request = require('supertest');
const URL = 'http://localhost:3000';
const bodyParser = require("body-parser");

describe('testing-guest-routes', () => {
    //test user is already created and has credentials  email: "johndoe@yahoo.com", password:"0000"
    let token;
    test('POST /login - success', async () => {
        const credentials = { email: 'johndoe@yahoo.com', password: '0000' };
        const { body } = await request(URL).post('/login').send(credentials);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('token');
        token = body.data.token;
    });
    
    test('GET /previous/add - success', async () => {
        await request(URL)
            .get('/add/1/2')
            .set('Authorization', 'Bearer ' + token);
        const { body } = await request(URL)
            .get('/previous/add/1')
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) + 1);
    });

    test('GET /previous/subtract - success', async () => {
        await request(URL)
            .get('/add/1/2')
            .set('Authorization', 'Bearer ' + token);
        const { body } = await request(URL)
            .get('/previous/subtract/1')
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) - 1);
    });

    test('GET /previous/multiply - success', async () => {
        await request(URL)
            .get('/add/1/2')
            .set('Authorization', 'Bearer ' + token);
        const { body } = await request(URL)
            .get('/previous/multiply/2')
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) * 2);
    });

    test('GET /previous/divide - success', async () => {
        await request(URL)
            .get('/add/1/2')
            .set('Authorization', 'Bearer ' + token);
        const { body } = await request(URL)
            .get('/previous/divide/2')
            .set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('previousValue');
        expect(body.data).toHaveProperty('result');
        expect(parseInt(body.data.result)).toBe(Math.round(parseInt(body.data.previousValue) / 2));
    });
});