var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connection;

//schema for users
var userSchema = new Schema({
    'firstName': {type: String, required: true},
    'lastName': {type: String, required: true},
    'userId': {type: String, required: true},
    'password': {type: String, required: true},
    'created': {type: Date, default: Date.now}
});


var User = db.model('User', userSchema);

module.exports = User;
