var express = require('express');
var router = express.Router();
var md5 = require('md5');
var path = require('path');
var multer = require('multer');

var User = require('../models/user');
var ProductGroup = require('../models/productGroup');
var Portfolio = require('../models/portfolio');
var ProductCategory = require('../models/categories');


var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test', {useMongoClient: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to database');
});

var Portfolio = new Portfolio({
    'title': 'test',
    'subtitle': 'test',
    'desc': 'test',
    'productGroups': ['abd'],
    'solutions': ['pnm'],
    'images': ['abc'],
    'videos': ['pqr'],
    'caseStudies': [],
    'whitePapers': [],
    'demoLinks': []
});

Portfolio.validate(function (res) {
    console.log('***********' + res);
});

/*var storageForImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var storageForVideos = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/videos')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var storageForPdf = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/pdf')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];
var validVideoTypes = ['video/mp4', 'video/ogg'];


var imageUploader = multer({
    storage: storageForImage,
    fileFilter: function (req, file, cb) {
        if (validImageTypes.indexOf(file.mimetype) == -1) {
            return cb('Only image files are allowed', false);
        }
        cb(null, true);
    }
});

var videoUploader = multer({
    storage: storageForVideos,
    fileFilter: function (req, file, cb) {
        if (validVideoTypes.indexOf(file.mimetype) == -1) {
            return cb('Only mp4/ogg type of videos are allowed', false);
        }
        cb(null, true);
    }
});

var pdfUploader = multer({
    storage: storageForPdf,
    fileFilter: function (req, file, cb) {
        if (file.mimetype != 'application/pdf') {
            return cb('Only pdf files are allowed', false);
        }
        cb(null, true);
    }
});

var uploadImageFile = imageUploader.any();
var uploadVideoFile = videoUploader.any();
var uploadPdfFile = pdfUploader.any();


var URL = 'mongodb://127.0.0.1:27017/vcecDb';
const MongoClient = require('mongodb').MongoClient;


function createDatabase() {
    //create database if not exist
    MongoClient.connect(URL, function (err, db) {
        if (err) throw err;
        console.log("Database created");
        db.close();
    });
}


function createAllCollections() {
    MongoClient.connect(URL, function (err, db) {
        if (err) throw err;

        var dbase = db.db("vcecDb");

        dbase.createCollection("users", function (err, res) {
            if (err) throw err;
            console.log("users Collection created!");
        });

        //create collections into database
        dbase.createCollection("portfolios", function (err, res) {
            if (err) throw err;
            console.log("portfolios Collection created!");
        });

        dbase.createCollection("groups", function (err, res) {
            if (err) throw err;
            console.log(" groups Collection created!");
            db.close();
        });
    });
}

createDatabase();
createAllCollections();


/!* GET home page.*!/
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/signUp', function (req, res, next) {
    if (req.body && req.body != null) {
        MongoClient.connect(URL, function (err, db) {
            if (err) throw err;
            var dbase = db.db("vcecDb");
            req.body.password = md5(req.body.password);
            dbase.collection("users").insertOne(req.body, function (qryErr, qryRes) {
                db.close();
                if (qryErr) {
                    res.send({
                        status: 500,
                        data: qryErr,
                        message: "Problem in query execution."
                    });
                } else {
                    res.send({
                        status: 200,
                        data: {},
                        message: "user created successfully."
                    });
                }
            });
        });
    }
});

router.post('/login', function (req, res, next) {
    if (req.body && req.body != null) {
        MongoClient.connect(URL, function (err, db) {
            if (err) throw err;
            var dbase = db.db("vcecDb");
            var query = {userId: req.body.userName, password: md5(req.body.password)};
            dbase.collection("users").find(query).toArray(function (qryErr, qryRes) {
                if (qryErr) {
                    res.send({
                        status: 500,
                        data: qryErr,
                        message: "Problem in query execution."
                    });
                } else if (qryRes.length == 0) {
                    res.send({
                        status: 400,
                        data: {},
                        message: "Invalid User."
                    });
                } else {
                    res.send({
                        status: 200,
                        data: {},
                        message: "Successfull Login."
                    });
                }
                db.close();
            });
        });
    }
});

router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Cache-Control ,Origin,Accept," +
        " X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

//api to create groups
router.post('/uploadImage', function (request, response) {
    uploadImageFile(request, response, function (err) {
        if (err) {
            console.log(err);
            // An error occurred when uploading
            response.send(err);
            return;
        }
        response.send({status: 200, data: {urlPath: "uploads/images/"}});
    });
});

//api to video type
router.post('/uploadVideo', function (request, response) {
    uploadVideoFile(request, response, function (err) {
        if (err) {
            // An error occurred when uploading
            response.send(err);
            return;
        }
        response.send({status: 200, data: {urlPath: "uploads/videos/"}});
    });
});

//api to pdf type
router.post('/uploadPdf', function (request, response) {
    uploadPdfFile(request, response, function (err) {
        if (err) {
            // An error occurred when uploading
            response.send(err);
            return;
        }
        response.send({status: 200, data: {urlPath: "uploads/pdf/"}});
    });
});

/!* GET home page. *!/
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/savePortfolio', function (req, res) {
    if (req.body && req.body != null) {
        MongoClient.connect(URL, function (err, db) {
            if (err) throw err;
            var dbase = db.db("vcecDb");
            dbase.collection("portfolios").insertOne(req.body, function (qryErr, qryRes) {
                db.close();
                if (qryErr) {
                    res.send({
                        status: 500,
                        data: qryErr,
                        message: "Problem in query execution."
                    });
                } else {
                    res.send({
                        status: 200,
                        data: {},
                        message: "Portfolio is saved."
                    });
                }
            });
        });
    }
});

router.get('/getPortfolio', function (req, res) {
    if (req && req.param) {
        MongoClient.connect(URL, function (err, db) {
            if (err) throw err;
            var dbase = db.db("vcecDb");
            var query = {title: req.param('title')};
            dbase.collection("portfolios").find(query).toArray(function (qryErr, qryRes) {
                if (qryErr) {
                    res.send({
                        status: 500,
                        data: qryErr,
                        message: "Problem in query execution."
                    });
                } else if (qryRes.length == 0) {
                    res.send({
                        status: 400,
                        data: {},
                        message: "No data found."
                    });
                } else {
                    res.send({
                        status: 200,
                        data: qryRes,
                        message: "Success"
                    });
                }
                db.close();
            })
        });
    }
});*/

module.exports = router;
