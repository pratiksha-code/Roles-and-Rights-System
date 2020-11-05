var mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

var studentSchema = mongoose.Schema({
    FirstName: String,
    LastName: String,
    DepartmentID: Number,
    UserID: {type: Number, unique: "User With This UserID Already Exist"}
});

//Validate Data
studentSchema.plugin(validator);

//Add Auto Increment To Event ID
studentSchema.plugin(AutoIncrement, {
    modelName: 'students',
    type: Number,
    unique: true,
    fieldName: 'StudentID'
});


module.exports = mongoose.model('students',studentSchema);