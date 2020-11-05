var mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const AutoIncrement = require('../lib/auto_increment')(mongoose);

var userTypeSchema = mongoose.Schema({
    UserTypeName: {type: String, unique: "User Type With This Name Already Exist"}
});

//Validate Data
userTypeSchema.plugin(validator);

//Add Auto Increment To Event ID
userTypeSchema.plugin(AutoIncrement, {
    modelName: 'usertypes',
    type: Number,
    unique: true,
    fieldName: 'UserTypeID'
});


module.exports = mongoose.model('usertypes', userTypeSchema);