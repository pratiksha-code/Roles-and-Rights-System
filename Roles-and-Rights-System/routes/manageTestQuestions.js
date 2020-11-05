const router = require('express').Router();

//Test Schema Imported Here
const testSchema = require('../schema/test.Schema');

//Test Questions Schema Imported Here
const testQuestionsSchema = require('../schema/testQuestions.schema');

//Method To Render Manage Test Questions Page
router.get('/manageTestQuestions', function (req, res) {
    testSchema.findOne({TestID: parseInt(req.query.TestID)}, function (err, test) {
        if (err)
            throw err;
        else
            res.render("ManageTestQuestions/index", {
                TestID: test.TestID,
                NoOfQuestions: test.NoOfQuestions,
                TestName: test.TestName
            })
    })
});

//Method To Create Test Questions
router.post('/manageTestQuestions/createQuestions', function (req, res) {
    testQuestionsSchema.findOne({TestID: req.body.TestID}, function (err, doc) {
        if (err)
           return res.sendStatus(500);
        else if (doc) {
            return res.sendStatus(200);
        } else if (!doc) {
            let newTestQuestions = new testQuestionsSchema(req.body);
            newTestQuestions.save(function (err) {
                if (err)
                    return res.sendStatus(500);
                else
                    return res.sendStatus(201);
            });
        }
    })

});


module.exports = router;