var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ResultService = require("../services/ResultService")
var resultService = new ResultService(db);
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);

/* Task 5 - Square root */
router.get('/:number1', function(req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "The number is not in correct format"});
    }
    if(number1 < 0) {
        return res.jsend.fail({"number1": "The number cannot be less than 0"}); 
    }
    const result = Math.sqrt(number1);
    const token = req.headers.authorization?.split(' ')[1];
    if(token) {
        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
            resultService.create("sqrt", Math.round(result), decodedToken.id);
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