const router = require('express').Router();

let isLoggedIn = require('../lib/isLoggedIn');

//Test Schema Imported Here
let testSchema = require('../schema/test.Schema');

//Test Questions Schema Imported Here
let testQuestions = require('../schema/testQuestions.schema');

//Test Results Schema Imported Here
let testResults = require('../schema/testResults.Schema');

//Method To Render Attempt Test Page
router.get('/attemptTest', isLoggedIn, function (req, res) {
    res.render("AttemptTest/index");
});

//Method To Attempt Test
router.post('/attemptTest/giveTest', function (req, res) {
    testSchema.findOne({TestName: req.body.TestName}, function (err, test) {
        if (err)
            res.sendStatus(500);
        else if (!test)
            res.sendStatus(200);
        else
            res.status(201).send({TestID: test.TestID, TestName: test.TestName});
    })
});

//Method To Render Tests Page
router.get('/test', function (req, res) {
    testResults.findOne({TestID: parseInt(req.query.TestID), UserID: req.session.UserID}, function (err, result) {
        console.log(result)
        if(err)
            res.render("GiveTest/error", {message: "Something Went Wrong..."});
        else if(result)
            res.render("GiveTest/error", {message: "You Have Already Attempted Test"});
        else if(!result)
            res.render("GiveTest/index", {TestID: parseInt(req.query.TestID), TestName: req.query.TestName});
    });
});

//Method To Get Test Questions
router.get('/getTestQuestions', function (req, res) {
    testQuestions.findOne({TestID: parseInt(req.query.TestID)}, function (err, testData) {
        if (err)
            res.sendStatus(500);
        else
            res.send(testData);
    })
});

//Method To Submit Test
router.post('/submitTest', function (req, res) {
    let newTestResult = {
        Score: req.body.Score,
        TestID: req.body.TestID,
        UserID: req.session.UserID
    };
    console.log(newTestResult)
    newTestResult = new testResults(newTestResult);
    newTestResult.save(function (err) {
        if (err)
            res.sendStatus(500);
        else
            res.sendStatus(201);
    })
});

router.get('/getScore', function (req, res) {
    testResults.find({}, function (err, scores) {
         if(err)
             res.sendStatus(500);
         else
             res.send(scores);
    });
});
module.exports = router;