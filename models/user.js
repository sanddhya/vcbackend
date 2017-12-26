var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;

autoIncrement.initialize(db);

//schema for users
var userSchema = new Schema({
    'firstName': {type: String, required: true},
    'lastName': {type: String, required: true},
    'userId': {type: String, required: true, unique: true},
    'password': {type: String, required: true},
    created_at: Number,
    updated_at: Number
});

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userId',
    startAt: 1,
    incrementBy: 1
});

userSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date().getTime();
    console.log('**************8' + currentDate);
    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    next();
});


var User = db.model('User', userSchema);

module.exports = User;
