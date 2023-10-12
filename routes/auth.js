var express = require('express');
var jsend = require('jsend'); // returning JSON responses following the jSend specification
var router = express.Router();
var db = require("../models");
var crypto = require('crypto'); // generates passwords for new users
var jwt = require('jsonwebtoken')
var UserService = require("../services/UserService") // to get and create users
var userService = new UserService(db);
var bodyParser = require('body-parser') // reads the JSON request's body
var jsonParser = bodyParser.json()
router.use(jsend.middleware);


/*
For the login
User should provide an email and password in the request's body
Then, we'll encrypt the password and compare it to the one from the database
*/
/* POST */
router.post('/login', jsonParser, async (req, res, next) => {
    const { email, password } = req.body;
    if (email == null) {
        return res.jsend.fail({"email": "Email is required."});
    }
    if (password == null) {
        return res.jsend.fail({"password": "Password is required."});
    }
    userService.getOne(email).then((data) => { // we look for a user based on email
        if(data === null) {
            return res.jsend.fail({"result": "Incorrect email or password"});
        }
        crypto.pbkdf2(password, data.Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
            if(err) {
                return cb(err);
            }
            if(!crypto.timingSafeEqual(data.EncryptedPassword, hashedPassword)) {
                return res.jsend.fail({"result": "Incorrect email or password"});
            }
            let token;
            try {
                token = jwt.sign({ id: data.id, email: data.Email },
                process.env.TOKEN_SECRET,
                { expiresIn: "1h" }
                );
            } catch (err) {
                res.jsend.error("Something went wrong with creating JWT token")
            }
            res.jsend.success({"result": "You are logged in", "id": data.id, email: data.Email, token: token});
        });
    });
});

router.post('/signup', async (req, res, next) => {
    const { name, email, password } = req.body; // we get name, email and password from the body parameters
    if(name == null) {
        return res.jsend.fail({"name": "Name is required."});
    }
    if(email == null) {
        return res.jsend.fail({"email": "Email is required."});
    }
    if(password == null) {
        return res.jsend.fail({"password": "Password is required."});
    }
    let user = await userService.getOne(email); // check if user already exists
    if(user != null) {
        return res.jsend.fail({"email": "Provided email is already in use."});
    }
    let salt = crypto.randomBytes(16); // we then use the crypto package to create an encrypted password for the user
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if(err) {
            return next(err);
        }
        userService.create(name, email, hashedPassword, salt) // we save the data in the Users table
        res.jsend.success({"result": "You created an account"}); // and return the response with jSend
    })
});

// for task 4:
/* DELETE */
router.delete('/', jsonParser, async function(req, res, next) {     
    let email = req.body.Email;
    if (email == null) {
        return res.jsend.fail({"email": "Email is required."});   }
    let user = await userService.getOne(email);
    if (user == null) {
        return res.jsend.fail({"email": "No such user in the database"});
    }
    await userService.delete(email);
    res.jsend.success({"result": "You deleted an account."});
});

module.exports = router;