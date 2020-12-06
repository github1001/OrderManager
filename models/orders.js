var mongoose = require('mongoose');
var modelSchema = mongoose.Schema;

var modelSchema = new mongoose.Schema({
    user: {type: modelSchema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}
});

module.exports = mongoose.model('Order', modelSchema);