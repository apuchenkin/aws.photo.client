'use strict';

var express = require('express'),
    cors = require('cors'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    _ = require('underscore')
;

var routes = require('./routes');
var path = require('path');
var app = express();

// uncomment after placing your favicon in /publicen
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Routing
//app.set('baseUrl', config.baseUrl);
routes.setup(app);

// *******************************************************
module.exports = app;
