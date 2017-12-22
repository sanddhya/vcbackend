var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connection;

//schema for categories
var productCategorySchema = new Schema({
    'category_name': {type: String, required: true},
    'created': {type: Date, default: Date.now}
});


var ProductCategory = db.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;
