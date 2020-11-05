const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

let testSchema = mongoose.Schema({
    TestName: {type: String, unique: "Test With Same Name Already Exist"},
    NoOfQuestions: Number,
    Marks: Number,
    Duration: {type: Number, default: 0},
    CreatedByUserID: Number,
    DepartmentID: Number
});

//Validate Data
testSchema.plugin(validator);

//Add Auto Increment To Event ID
testSchema.plugin(AutoIncrement, {
    modelName: 'tests',
    type: Number,
    unique: true,
    fieldName: 'TestID'
});


module.exports = mongoose.model('tests', testSchema);