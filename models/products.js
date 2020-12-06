var mongoose = require('mongoose');
var modelSchema = mongoose.Schema;

var modelSchema = new mongoose.Schema({
    image:{type:String, required:true},
    label:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},


});

module.exports = mongoose.model('Product', modelSchema);

