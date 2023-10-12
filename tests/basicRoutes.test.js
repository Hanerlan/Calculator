/*
Here we will test all basic operations available to non-authenticated users
*/

const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()

const bodyParser = require("body-parser");

const addRoutes = require("../routes/add");
const subtractRoutes = require("../routes/subtract");
const multiplyRoutes = require("../routes/multiply");
const divideRoutes = require("../routes/divide");

app.use(bodyParser.json());
app.use("/add", addRoutes);
app.use("/subtract", subtractRoutes);
app.use("/multiply", multiplyRoutes);
app.use("/divide", divideRoutes);

/* One negative and one positive test for the /add, /subtract, /multiply and /divide endpoints */
describe("testing-guest-routes", () => {
    test("GET /add/1/2 - success", async () => {
        const { body } = await request(app).get("/add/1/2");
        expect(body).toEqual({
            "status": "success",
            "data": {
                "result": 3
            }
        });
    });

    test("GET /add/1/a - fail", async () => {
        const { body } = await request(app).get("/add/1/a");
        expect(body).toEqual({
            "status": "fail",
            "data": {
                "number2": "number2 is not in correct format"
            }
        });
    });

    test("GET /subtract/3/6 - success", async () => {
        const { body } = await request(app).get("/subtract/3/6");
        expect(body).toEqual({
            "status": "success",
            "data": {
                "result": -3
            }
        });
    });

    test("GET /subtract/a/3 - fail", async () => {
        const { body } = await request(app).get("/subtract/a/3");
        expect(body).toEqual({
            "status": "fail",
            "data": {
                "number1": "number1 is not in correct format"
            }
        });
    });

    test("GET /multiply/1/2 - success", async () => {
        const { body } = await request(app).get("/multiply/1/2");
        expect(body).toEqual({
            "status": "success",
            "data": {
                "result": 2
            }
        });
    });

    test("GET /multiply/1/a - fail", async () => {
        const { body } = await request(app).get("/multiply/1/a");
        expect(body).toEqual({
            "status": "fail",
            "data": {
                "number2": "number2 is not in correct format"
            }
        });
    });

    test("GET /divide/2/1 - success", async () => {
        const { body } = await request(app).get("/divide/2/1");
        expect(body).toEqual({
            "status": "success",
            "data": {
                "result": 2
            }
        });
    });

    test("GET /divide/1/0 - fail", async () => {
        const { body } = await request(app).get("/divide/1/0");
        expect(body).toEqual({
            "status": "fail",
            "data": {
                "number2": "number2 cannot be 0"
            }
        });
    });
});


/*
We use the Supertest package to make requests to our API easily
We check that the response's body is exactly what was expected
*/