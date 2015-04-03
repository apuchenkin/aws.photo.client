'use strict';

var _ = require('underscore');
var moment = require('moment');
var PhotoRepository = require('../repository/photos');

module.exports = function () {
  var me = this;

  me.paramConverter = function (req, res, next, id) {
    req.photo = PhotoRepository.get(id);
    if (!req.photo) {
      throw Error('Not found');
    } else {
      next();
    }
  };

  /**
   * GET /photo
   */
  me.getPhotos = function (req, res) {
    return res.status(200).send(PhotoRepository.toJSON());
  };

  /**
   * GET /photo/1
   */
  me.getPhoto = function (req, res) {
    var photo = req.photo;
    photo.set('views', photo.get('views') + 1);
    photo.save();
    return res.status(200).send(photo.toJSON());
  };
};
