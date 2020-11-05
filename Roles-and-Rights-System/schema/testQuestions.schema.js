const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

let testQuestionsSchema = mongoose.Schema({
    TestID: {type: Number, unique: "Questions For This TestID Already Exists"},
    Questions: [],
    Options:[]
});

//Validate Data
testQuestionsSchema.plugin(validator);

//Add Auto Increment To Event ID
testQuestionsSchema.plugin(AutoIncrement, {
    modelName: 'test_questions',
    type: Number,
    unique: true,
    fieldName: 'TestQuestionsID'
});


module.exports = mongoose.model('test_questions', testQuestionsSchema);