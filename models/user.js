var mongoose = require('mongoose');
var modelSchema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var modelSchema = new mongoose.Schema({
    email:{type:String, required:true},
    password:{type:String, required:true}


});

modelSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);

};

modelSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);

};

module.exports = mongoose.model('User', modelSchema);