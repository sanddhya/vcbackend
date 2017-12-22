var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connection;
//Schema for products Group
var productGroupSchema = new Schema({
    'group_name': {type: String, required: true},
    'created': {type: Date, default: Date.now}
});


var ProductGroup = db.model('ProductGroup', productGroupSchema);

module.exports = ProductGroup;

