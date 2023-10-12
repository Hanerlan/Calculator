var express = require('express');
const jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ResultService = require("../services/ResultService")
var resultService = new ResultService(db);
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.get('/:number1/:number2', (req, res) => {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const number2 = parseInt(req.params.number2);
    if(isNaN(number2)) {
        return res.jsend.fail({"number2": "number2 is not in correct format"});
    }
    const result = number1 + number2; // after calculating the result
    const token = req.headers.authorization?.split(' ')[1]; // we check whether the token was set in the authorization header
    if(token) { // if it was
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET ); // we decode it 
            resultService.create("add", result, decodedToken.id); // and use the result service to save the result to the database
        }
        catch(err) {
            res.jsend.success({"result": result, "message": err});
        }
    }
    res.jsend.success({"result": result});
});

module.exports = router;

/*
The router handler should only contain those functions that directly handle requests to the endpoints,
which is relevant for this part of the code:

    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const number2 = parseInt(req.params.number2);
    if(isNaN(number2)) {
        return res.jsend.fail({"number2": "number2 is not in correct format"});
    }
    const result = number1 + number2;

To fix this, we can create an external file - numberHelper.js:

    function add(number1, number2) {
    return number1, number2;
}

function parseParameters(number1, number2) {
    const intNumber1 = parseInt(number1);
    const intNumber2 = parseInt(number2);
    if(isNaN(intNumber1)) {
        return {number1: "number1 is not in correct format"};
    }
    if(isNaN(intNumber2)) {
        return {number2: "number2 is not in correct format"};
    }
    return {number1: intNumber1, number2: intNumber2}
}

-----
Edge case - possible but unusual scenario where our application might behave in an unexpected way.

-----
In bigger applications, good idea to use unit testing. 
Not much to test in our application, as arithmetic operations don’t necessarily need that.
To introduce unit testing, restructure the code into smaller parts instead of having the entire logic in router files and services.

We implemented an API that is not a web application - JWT is much more convenient than a session

-----
Task - Test the signup method:
Implement the method in the user service to delete the user of the provided email (so it doesn't affect the database)
    - create a new user
    - log in to the application
    - make at least one call to any of the /previous operations
    - delete the user at the end.
*/