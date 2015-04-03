'use strict';

var Backbone = require('backbone');
var Photo = require('../model/photo');
var fs = require('fs');

module.exports = (function () {
  var srcs = fs.readdirSync('../app/images/gallery');

  var UserRepository = Backbone.Collection.extend({
    model: Photo
  });
  var repository = new UserRepository();
  var photos = srcs.map(function (item) {
      var photo = repository.create({name: item});
      //photo.save();
      return photo
    }
  );

  return repository;
}());

