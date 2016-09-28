"use strict";

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const _ = require('lodash');
const moment = require('moment');
const glob = require('glob');
const UrlPattern = require('url-pattern');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis').createClient();
const cookie = require('cookie');

const token = require('./app/utils/token');
const config = require('./app/config');

const app = express();

// Initialize global
global.connections = {};

// Disable html cache
app.use(function noCacheForRoot(req, res, next) {
    let regex = '^/$|/[a-z]+$';
    if (req.url.match(new RegExp(regex, 'i'))) {
        res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", '-1');
    }
    next();
});

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Initialize redis store
let redisOptions = {
    host: 'localhost',
    port: 6379,
    client: redis
};

app.use(session({
    store: new RedisStore(redisOptions),
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));

// public folder
app.use(express.static('public'));

// Cache db connections
app.use(function(req, res, next) {

    // Get subdomain from request
    let subdomain = req.subdomains[0];

    // Skip some subdomains
    // if (skipSubdomains.indexOf(subdomain) > -1 || !subdomain) {
    //     return next();
    // }

    let dbname = 'mable-test-' + subdomain;

    // If db connection is not cached
    if (!global.connections[dbname] || !global.connections[dbname].db || moment().isAfter(global.connections[dbname].expires)) {
        if (!global.connections[dbname] || !global.connections[dbname].db) {
            // Create MongoDB connection
            let DBClient = mongoose.createConnection('mongodb://localhost:27017/' + dbname);
            DBClient.on('connected', function () {
                // Init model cache
                req.db = {};

                // Get all models
                glob("./app/models/*.js", null, function (err, files) {

                    if (err) {
                        return next();
                    }

                    // Cache each model
                    _.forEach(files, (file) => {

                        // Get model name
                        let name = file.split('/').pop();
                        name = name.split('.').shift();

                        // Cache model into request for easy access
                        req.db[name] = require(file)(DBClient);
                    });

                    global.connections[dbname] = {
                        db: DBClient,
                        expires: moment().add(10, 'm'),
                        models: req.db
                    };
                    next();
                });
            });

            // If the Node process ends, close the Mongoose connection
            process.on('SIGINT', function () {
                DBClient.close(function () {
                    console.log(dbname + ' connection disconnected through app termination');
                    process.exit(0);
                });
            });
        } else {
            global.connections[dbname].expires = moment().add(3, 'm');
            req.db = global.connections[dbname].models;
            next();
        }
    } else {
        req.db = global.connections[dbname].models;
        next();
    }
});

// Body parser configuration
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// setup multipart/form-data request
app.use(multer({ dest: 'public/uploads' }));

// Set app port
app.set('port', (process.argv[2] || 9999));

// Create Express router
let router = express.Router();

// Route middleware to verify API route permissions
router.use(function(req, res, next) {

    // Skip preflight requests
    if (req.method === 'OPTIONS') {
        return next();
    }

    // Allow public API to work without token
    let route = _.find(config.routes, function (route) {
        let pattern = new UrlPattern(route.url);
        return !!pattern.match(req._parsedUrl.pathname);
    });

    // 'route.methods[req.method.toLowerCase()]' will be undefined and undefined.permission goes boom
    if (!route || !route.methods[req.method.toLowerCase()]) {
        return res.status(404).send();
    }

    // Skip if API route is public
    if (!route.methods[req.method.toLowerCase()].permission.length) {
        return next();
    }

    // Check header or url parameters or post parameters for token
    let cookies = cookie.parse(req.headers.cookie || '');
    let accessToken = cookies.access_token;

    if (accessToken) {
        token.getDataByToken(accessToken, function(err, data) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                let role = data.role; //Modified from data.role.name
                if (route.methods[req.method.toLowerCase()].permission.indexOf(role) !== -1) {
                    // Good to go
                    req.user = data;
                    next();
                } else {
                    return res.status(403).send({
                        success: false,
                        message: 'Permission denied.'
                    });
                }
            }
        });
    } else {
        // If there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});


// Setup API routes from config
for (let i = 0; i < config.routes.length; ++ i) {
    let route = config.routes[i];
    let routeObj = router.route(route.url);

    for (let method in route.methods) {
        routeObj[method](route.methods[method].operation);
    }
}

// API namespace
app.use('/api', router);

// Start the app
app.listen(app.get('port'));