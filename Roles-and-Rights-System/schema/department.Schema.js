var mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

var departmentSchema = mongoose.Schema({
    DepartmentName: {type: String, unique: "Department With This Name Already Exist"},
    CreatedByUserID: Number
});

//Validate Data
departmentSchema.plugin(validator);

//Add Auto Increment To Event ID
departmentSchema.plugin(AutoIncrement, {
    modelName: 'departments',
    type: Number,
    unique: true,
    fieldName: 'DepartmentID'
});


module.exports = mongoose.model('departments', departmentSchema);