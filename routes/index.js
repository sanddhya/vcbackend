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

//settings for CORS
router.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Cache-Control ,Origin,Accept," +
        " X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

var storageForImage = multer.diskStorage({
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


/* GET home page.*/
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//signup api with validation
router.post('/signUp', function (req, res, next) {
    if (req.body && req.body != null) {
        var user = new User(req.body);
        user.validate(function (error) {
            if (!error) {
                //check for duplicate
                User.find({'userId': req.body.userId}, function (err, userId) {
                    if (err || userId) {
                        res.send({
                            status: 400,
                            data: err,
                            message: "User Id must be unique."
                        });
                    } else {
                        user.save(function (err) {
                            if (err) {
                                res.send({
                                    status: 400,
                                    data: err,
                                    message: "Invalid data."
                                });
                            } else {
                                res.send({
                                    status: 200,
                                    message: "user created successfully."
                                });
                            }
                        });
                    }
                });
            } else {
                res.send({
                    status: 400,
                    data: error.message,
                    message: 'Invalid data.'
                })
            }
        });
    }
});


router.post('/login', function (req, res, next) {
    if (req.body && req.body != null) {
        var query = {userId: req.body.userName, password: md5(req.body.password)};
        User.find(query, function (err, user) {
            if (err) {
                res.send({
                    status: 400,
                    message: "Invalid Username/Password."
                });
            } else {
                res.send({
                    status: 200,
                    message: "Success"
                });
            }
        });
    }
});

//api to create groups
router.post('/uploadImage', function (request, response) {
    uploadImageFile(request, response, function (err) {
        if (err) {
            // An error occurred when uploading
            response.send({status: 400, data: err});
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
            response.send({status: 400, data: err});
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
            response.send({status: 400, data: err});
            return;
        }
        response.send({status: 200, data: {urlPath: "uploads/pdf/"}});
    });
});

router.post('/savePortfolio', function (req, res) {
    if (req.body && req.body != null) {
        req.body.productGroups = ['Location Intelligence'];
        req.body.solutions = ['By Industry'];
        var portfolio = new Portfolio(req.body);
        portfolio.validate(function (validationError) {
            if (validationError) {
                res.send({
                    status: 400,
                    message: validationError.message
                });
            } else {
                Portfolio.find({title: req.body.title}, function (error, object) {
                    if (error) {
                        res.send({
                            status: 500,
                            message: 'Problem in query execution.'
                        });
                    } else if (object.length > 0) {
                        res.send({
                            status: 400,
                            message: 'Portfolio with title ' + req.body.title + 'already exist.'
                        });
                    } else {
                        portfolio.save(function (err, object) {
                            if (err) {
                                res.send({
                                    status: 400,
                                    data: err,
                                    message: 'Query execution failed.'
                                });
                            } else {
                                res.send({
                                    status: 200,
                                    message: 'Portfolio saved.'
                                });
                            }
                        })
                    }
                });
            }
        });
    }
});

router.get('/getPortfolio', function (req, res) {
    if (req && req.param) {
        if (!req.param('title')) {
            res.send({
                status: 400,
                message: 'title parameter is required.'
            });
        } else {
            db.db.listCollections({name: 'portfolios'}).next(function (err, collinfo) {
                if (collinfo) {
                    Portfolio.find({title: req.param('title')}, function (err, response) {
                        console.log(err);
                        console.log(response);
                        if (err) {
                            res.send({
                                status: 500,
                                data: err,
                                message: 'Query execution failed.'
                            })
                        } else if (!response || response.length == 0) {
                            res.send({
                                status: 400,
                                data: err,
                                message: 'Portfolio not found.'
                            })
                        } else {
                            res.send({
                                status: 200,
                                data: response
                            })
                        }
                    });
                } else {
                    res.send({
                        status: 200,
                        data: "No data found"
                    });
                }
            });

        }
    }
});

router.get('/getAllPortfolio', function (req, res) {
    if (req && req.param) {
        db.db.listCollections({name: 'portfolios'}).next(function (err, collinfo) {
            if (collinfo) {
                Portfolio.find({}, function (err, response) {
                    if (err || !response || response.length == 0) {
                        res.send({
                            status: 400,
                            data: err,
                            message: 'Portfolio not found.'
                        })
                    } else {
                        res.send({
                            status: 200,
                            data: response
                        })
                    }
                });
            } else {
                res.send({
                    status: 200,
                    data: "No data found"
                });
            }
        });
    }
});


router.post('/updatePortfolio', function (req, res) {
    if (req.body && req.body != null) {
        var portfolioObj = new Portfolio(req.body);
        var portfolio = {};
        portfolio = Object.assign(portfolio, portfolioObj._doc);
        delete portfolio._id;

        portfolioObj.validate(function (validationError) {
            if (validationError) {
                res.send({
                    status: 400,
                    message: validationError.message
                });
            } else {
                Portfolio.find({portfolioId: req.body.portfolioId}, function (error, object) {
                    if (error) {
                        res.send({
                            status: 500,
                            message: 'Problem in query execution.'
                        });
                    } else if (object.length == 0) {
                        res.send({
                            status: 400,
                            message: 'Portfolio with given id does not exist.'
                        });
                    } else {
                        Portfolio.update({'portfolioId': req.body.portfolioId}, portfolio, function (err, object) {
                            if (err) {
                                res.send({
                                    status: 500,
                                    data: err,
                                    message: 'Query execution failed.'
                                });
                            } else {
                                res.send({
                                    status: 200,
                                    data: object,
                                    message: 'Portfolio saved.'
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

router.post('/deletePortfolio', function (req, res) {
    if (req.body) {
        Portfolio.remove({portfolioId: req.body.portfolioId}, function (err, object) {
            if (!err) {
                res.send({
                    status: 200,
                    data: object,
                    message: 'deleted successfully.'
                })
            } else {
                res.send({
                    status: 500,
                    data: err,
                    message: 'Problem in query execution.'
                })
            }
        });
    }
});

router.post('/saveGroup', function (req, res) {
    console.log(req);
    if (req.body && req.body != null) {
        var group = new ProductGroup(req.body);
        group.validate(function (validationError) {
            if (validationError) {
                return {
                    status: 400,
                    message: validationError.message
                }
            } else {
                ProductGroup.find({'group_name': req.body.group_name}, function (err, object) {
                    if (err) {
                        res.send({
                            status: 500,
                            data: err
                        });
                    } else if (object.length > 0) {
                        res.send({
                            status: 400,
                            data: 'Group with same name already exist'
                        });
                    } else {
                        group.save(function (err, object) {
                            if (err) {
                                res.send({
                                    status: 400,
                                    data: err,
                                    message: 'Query execution error.'
                                });
                            } else {
                                res.send({
                                    status: 200,
                                    data: object,
                                    message: 'Group saved successfully.'
                                });
                            }
                        });
                    }
                });
            }
        })
    }
});


router.post('/saveSolution', function (req, res) {
    if (req.body && req.body != null) {
        var group = new ProductCategory(req.body);
        group.validate(function (validationError) {
            if (validationError) {
                return {
                    status: 400,
                    message: validationError.message
                }
            } else {
                ProductCategory.find({'category_name': req.body.category_name}, function (err, object) {
                    if (err) {
                        res.send({
                            status: 500,
                            data: err
                        });
                    } else if (object.length > 0) {
                        res.send({
                            status: 400,
                            data: 'Category with same name already exist'
                        });
                    } else {
                        group.save(function (err, object) {
                            if (err) {
                                res.send({
                                    status: 400,
                                    data: err,
                                    message: 'Query execution error.'
                                });
                            } else {
                                res.send({
                                    status: 200,
                                    data: object,
                                    message: 'Category saved successfully.'
                                });
                            }
                        });
                    }
                });
            }
        })
    }
});


router.post('/updateSolution', function (req, res) {
    if (req.body && req.body != null) {
        ProductCategory.find({'categoryId': req.body.categoryId}, function (err, solution) {
            if (err) {
                res.send({
                    status: 400,
                    data: {},
                    message: 'No solution with given id exist.'
                });
            } else {
                ProductCategory.update({'categoryId': req.body.categoryId}, req.body, function (err, updatedSolution) {
                    if (err) {
                        res.send({
                            status: 400,
                            data: "Problem in query execution."
                        });
                    }
                    res.send({
                        status: 200,
                        data: updatedSolution
                    });
                });
            }
        });
    }
});

router.post('/updateGroup', function (req, res) {
    if (req.body && req.body != null) {
        ProductCategory.find({'productGroupId': req.body.productGroupId}, function (err, group) {
            if (err) {
                res.send({
                    status: 400,
                    data: {},
                    message: 'No group with given id exist.'
                });
            } else {
                ProductGroup.update({'productGroupId': req.body.productGroupId}, req.body, function (err, updatedGroup) {
                    if (err) {
                        res.send({
                            status: 400,
                            data: "Problem in query execution."
                        });
                    }
                    res.send({
                        status: 200,
                        data: updatedGroup
                    });
                })
            }
        });
    }
});

router.get('/getAllSolutions', function (req, res) {
    db.db.listCollections({name: 'productcategories'})
        .next(function (err, collinfo) {
            if (collinfo) {
                ProductCategory.find(function (err, object) {
                    if (err) {
                        res.send({
                            status: 500,
                            data: err
                        });
                    } else {
                        res.send({
                            status: 200,
                            data: object
                        });
                    }
                });
            } else {
                res.send({
                    status: 200,
                    data: "No data found"
                });
            }
        });
});

router.get('/getAllGroups', function (req, res) {
    db.db.listCollections({name: 'productgroups'})
        .next(function (err, collinfo) {
            if (collinfo) {
                ProductGroup.find({}, function (err, objects) {
                    if (err) {
                        res.send({
                            status: 500,
                            data: err
                        });
                    } else {
                        res.send({
                            status: 200,
                            data: objects
                        });
                    }
                });
            } else {
                res.send({
                    status: 200,
                    data: "No data found"
                });
            }
        });
});


module.exports = router;
