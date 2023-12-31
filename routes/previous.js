var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var ResultService = require("../services/ResultService")
var resultService = new ResultService(db);
var jwt = require('jsonwebtoken')

router.use(jsend.middleware);


/* GET */
router.get('/add/:number1', async (req, res, next) => {
    const number1 = parseInt(req.params.number1); // we take number 1 from the route and parse it to an integer
    if(isNaN(number1)) { 
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const token = req.headers.authorization?.split(' ')[1]; 
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET ); // then we decode the token
    }
    catch(err) {
        return res.jsend.fail({"result": err});
    }
    const previous = await resultService.getOne(decodedToken.id); // if everything works correctly
    if (!previous) { // Handle the case where no result is found for the user.
        return res.jsend.fail({"result": "Previous result not found for the user."});
    }
    const result = previous.Value + number1; // we use the result service to get the previous value from the database
    resultService.create("add", result, decodedToken.id); // we then use it to calculate the result 
    res.jsend.success({
        "result": result, 
        "previousOperation": previous.OperationName, 
        "previousValue": previous.Value
    }); // and save it in the database and send the response to the user
});


router.get('/subtract/:number1', async (req, res, next) => {
    const number1 = parseInt(req.params.number1); 
    if(isNaN(number1)) { 
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const token = req.headers.authorization?.split(' ')[1]; 
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET ); 
    }
    catch(err) {
        return res.jsend.fail({"result": err});
    }
    const previous = await resultService.getOne(decodedToken.id);
    if (!previous) { 
        return res.jsend.fail({"result": "Previous result not found for the user."});
    }
    const result = previous.Value - number1; 
    resultService.create("subtract", result, decodedToken.id); 
    res.jsend.success({
        "result": result, 
        "previousOperation": previous.OperationName, 
        "previousValue": previous.Value
    });
});

router.get('/multiply/:number1', async (req, res, next) => {
    const number1 = parseInt(req.params.number1); 
    if(isNaN(number1)) { 
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    const token = req.headers.authorization?.split(' ')[1]; 
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET ); 
    }
    catch(err) {
        return res.jsend.fail({"result": err});
    }
    const previous = await resultService.getOne(decodedToken.id); 
    if (!previous) { 
        return res.jsend.fail({"result": "Previous result not found for the user."});
    }
    const result = previous.Value * number1; 
    resultService.create("multiply", result, decodedToken.id); 
    res.jsend.success({
        "result": result, 
        "previousOperation": previous.OperationName, 
        "previousValue": previous.Value
    }); 
});

router.get('/divide/:number1', async function(req, res, next) {
    const number1 = parseInt(req.params.number1);
    if(isNaN(number1)) {
        return res.jsend.fail({"number1": "number1 is not in correct format"});
    }
    if(number1 == 0) {
        return res.jsend.fail({"number1": "number1 cannot be 0"}); 
    }
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
    }
    catch(err) {
        return res.jsend.fail({"result": err});
    }
    const previous = await resultService.getOne(decodedToken.id); 
    if (!previous) { 
        return res.jsend.fail({"result": "Previous result not found for the user."});
    }
    const result = previous.Value / number1; 
    resultService.create("divide", Math.round(result), decodedToken.id); 
    if (Number.isInteger(result)) {
        res.jsend.success({
            "result": result, 
            "previousOperation": previous.OperationName, 
            "previousValue": previous.Value
        });
    }
    else {
        res.jsend.success({
            "result": Math.round(result), 
            "previousOperation": previous.OperationName, 
            "previousValue": previous.Value, 
            "message": "Result has been rounded, as it was not an integer."});
    }
});


/* Task 5 - Square root */
router.get('/sqrt', async function(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.jsend.fail({"result": "JWT token not provided"});
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
    }
    catch(err) {
        return res.jsend.fail({"result": err});
    }
    const previous = await resultService.getOne(decodedToken.id); 
    if (!previous) { 
        return res.jsend.fail({"result": "Previous result not found for the user."});
    }
    if (previous.Value < 0) {
        return res.jsend.fail({"result": "Previous value is negative"})
    }
    const result = Math.sqrt(previous.Value); 
    resultService.create("sqrt", Math.round(result), decodedToken.id); 
    if (Number.isInteger(result)) {
        res.jsend.success({
            "result": result, 
            "previousOperation": previous.OperationName, 
            "previousValue": previous.Value
        });
    }
    else {
        res.jsend.success({
            "result": Math.round(result), 
            "previousOperation": previous.OperationName, 
            "previousValue": previous.Value, 
            "message": "Result has been rounded, as it was not an integer."
        });
    }
});


module.exports = router;