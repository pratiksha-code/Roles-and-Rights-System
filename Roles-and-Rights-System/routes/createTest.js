const router = require('express').Router();

//Test Schema Imported Here
let testSchema = require('../schema/test.Schema');

//Is Logged In Middleware Imported Here
let isLoggedIn = require('../lib/isLoggedIn');

//Method To Render Create Test Page
router.get("/createTest", isLoggedIn, function (req, res) {
    res.render("CreateTest/index");
});

//Method To Create Test
router.post('/createTest', isLoggedIn, function (req, res) {
    let newTest = new testSchema(req.body);
    newTest.save(function (err, test) {
        if (err) {
            if (err.name === 'ValidationError') {
                let errorMessages = err.message.replace("tests validation failed:", "");
                errorMessages = errorMessages.split(',');
                for (let i = 0; i < errorMessages.length; i++) {
                    errorMessages[i] = errorMessages[i].split(':')[1];
                }
                return res.status(200).send({message: errorMessages});
            } else {
                return res.sendStatus(500);
            }
        }
        else
            return res.status(201).send(test);
    });
});

module.exports = router;