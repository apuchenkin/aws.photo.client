'use strict';

var express = require('express');

var PhotoHandler = require('./handlers/photo');

var handlers = {
  photo: new PhotoHandler()
};

function setup(app) {

  var PhotoRouter = express.Router();
  PhotoRouter.route('/')
    .get(handlers.photo.getPhotos)
  ;
  PhotoRouter.param('photo_id', handlers.photo.paramConverter);
  PhotoRouter.route('/:photo_id')
    .get(handlers.photo.getPhoto)
  ;

  app.use('/photo', PhotoRouter);
}

exports.handlers = handlers;
exports.setup = setup;
