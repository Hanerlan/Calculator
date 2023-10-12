var express = require('express');
const jsend = require('jsend');
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
    const result = number1 * number2;
    const token = req.headers.authorization?.split(' ')[1]; // we check whether the token was set in the authorization header
    if(token) { // if it was
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET ); // we decode it 
            resultService.create("multiply", result, decodedToken.id); // and use the result service to save the result to the database
        }
        catch(err) {
            res.jsend.success({"result": result, "message": err});
        }
    }
    res.jsend.success({"result": result});
});

module.exports = router;