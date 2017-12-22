var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var db = mongoose.connection;

//schema for portfolios
var portfolioSchema = new Schema({
    'title': {type: String, required: true},
    'subtitle': {type: String, required: true},
    'productGroups': {type: [String], required: true},
    'solutions': {type: [String], required: true},
    'desc': {type: String, required: true},
    'images': {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                if (!Array.isArray(arr)) return false;
                return arr.every(function (val) {
                    return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(val);
                })
            },
            message: "Please provide valid Image Urls."
        }
    },
    'videos': {
        type: [String], required: true,
        validate: {
            validator: function (arr) {
                if (!Array.isArray(arr)) return false;
                return arr.every(function (val) {
                    return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(val);
                })
            },
            message: "Please provide valid video Urls."
        }
    },
    'caseStudies': {
        type: [String],
        validate: {
            validator: function (arr) {
                if (!Array.isArray(arr)) return false;
                return arr.every(function (val) {
                    return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(val);
                })
            },
            message: "Please provide valid case studies Urls."
        }
    },
    'whitePapers': {
        type: [String],
        validate: {
            validator: function (arr) {
                if (!Array.isArray(arr)) return false;
                return arr.every(function (val) {
                    return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(val);
                })
            },
            message: "Please provide valid white papers Urls."
        }
    },
    'demoLinks': {
        type: [String],
        validate: {
            validator: function (arr) {
                if (!Array.isArray(arr)) return false;
                return arr.every(function (val) {
                    return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(val);
                })
            },
            message: "Please provide valid demo links."
        }
    }
});



var Portfolio = db.model('Portfolio', portfolioSchema);

module.exports = Portfolio;
