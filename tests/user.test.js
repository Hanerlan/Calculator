/*
Test for the signup method - Task 4
*/
const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()

const bodyParser = require("body-parser");

const previousRoutes = require("../routes/previous");
const authRoutes = require("../routes/auth");
const addRoutes = require("../routes/add");

app.use(bodyParser.json());
app.use("/previous", previousRoutes);
app.use("/add", addRoutes);
app.use("/", authRoutes);

describe("testing-guest-routes", () => {
    test("POST /signup - success", async () => {
        const credentials = {
            name: "testuser",
            email: "test@test.com",
            password: "test"
        }
        const { body } = await request(app).post("/signup").send(credentials);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("You created an account")   
    });

    let token;
    test("POST /login - success", async () => {
        const credentials = {
            email: "test@test.com",
            password: "test"
        }
        const { body } = await request(app).post("/login").send(credentials);     
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("token");     
        token = body.data.token
        console.log(token)
    });

    test("GET /previous/add - success", async () => {
        await request(app).get("/add/1/2").set('Authorization', 'Bearer' + token);
        const { body } = await request(app).get("/previous/add/1").set('Authorization', 'Bearer ' + token);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("previousValue");
        expect(body.data).toHaveProperty("result");
        expect(parseInt(body.data.result)).toBe(parseInt(body.data.previousValue) + 1);
    });

    test("DELETE / - success", async () => {
        const credentials = {
            email: "test@test.com",
        }
        const { body } = await request(app).delete("/").send(credentials);
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("You deleted an account.")   
    });
});