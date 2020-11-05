const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

let testResultSchema = mongoose.Schema({
    TestID: Number,
    UserID: Number,
    Score: Number
});

//Validate Data
testResultSchema.plugin(validator);

//Add Auto Increment To Event ID
testResultSchema.plugin(AutoIncrement, {
    modelName: 'test_results',
    type: Number,
    unique: true,
    fieldName: 'TestResultID'
});


module.exports = mongoose.model('test_results', testResultSchema);