var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ResultService = require("../services/ResultService")
var resultService = new ResultService(db);
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

router.get('/:number1/:number2', function(req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const number2 = parseInt(req.params.number2);
    if(isNaN(number2)) {
        return res.jsend.fail({"number2": "number2 is not in correct format"});
    }
    if(number2 == 0) {
        return res.jsend.fail({"number2": "number2 cannot be 0"}); 
    }
    const result = number1 / number2;
    const token = req.headers.authorization?.split(' ')[1];
    if(token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
            resultService.create("divide", Math.round(result), decodedToken.id);
        }
        catch(err) {
            if (Number.isInteger(result)) {
                res.jsend.success({"result": result, "error": err});
            }
            else {
                res.jsend.success({"result": Math.round(result), "error": err, "message": "Result has been rounded, as it was not an integer."});
            } 
        }
    }
    if (Number.isInteger(result)) {
        res.jsend.success({"result": result});
    }
    else {
        res.jsend.success({"result": Math.round(result), "message": "Result has been rounded, as it was not an integer."});
    } 
});


module.exports = router;

/*
We check the same conditions as in previous cases (if number1 and number2 are numbers), 
additionally, we check if number2 is 0 (we cannot divide by 0) 
and if the result is an integer (we have to return an integer, but the result of dividing two integers does not have to be an integer). 
When result is not an integer, we round it to the closest integer.
*/