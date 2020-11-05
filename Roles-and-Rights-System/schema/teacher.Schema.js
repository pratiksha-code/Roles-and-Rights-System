let mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

let teacherSchema = mongoose.Schema({
    FirstName: String,
    LastName: String,
    DepartmentID: Number,
    UserID: {type: Number, unique: "User With This UserID Already Exist"}
});

//Validate Data
teacherSchema.plugin(validator);

//Add Auto Increment To Event ID
    teacherSchema.plugin(AutoIncrement, {
    modelName: 'teachers',
    type: Number,
    unique: true,
    fieldName: 'teacherID'
});


module.exports = mongoose.model('teachers',teacherSchema);