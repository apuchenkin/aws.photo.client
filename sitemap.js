'use strict';

var
  _ = require('lodash'),
  sm = require('sitemap'),
  fs = require('fs'),
  http = require('http'),
  Q = require('q'),
  Hashes = require('jshashes'),
  config = require('./app/config/production.json'),
  urls = [
    { url: '/',  changefreq: 'monthly'}
  ],
  promises = [],
  baseUrl = config.hostname,
  sha = new Hashes.SHA1(),
  w = 1200,
  h = 900
;

_.map(config.static, function(s){
  urls.push({ url: '/' + s,  changefreq: 'monthly'});
});

var deferred = Q.defer();
var remapPhoto = function (id) {
  var sign = sha.hex_hmac(config.secret, id + '-' + w + 'x' + h);
  return [config.apiEndpoint, 'hs/photo', id, w, h, sign].join('/');
};

http.get(_.filter([baseUrl, config.apiEndpoint, 'category']).join('/'), function(response) {
  console.log('Got response: ' + response.statusCode);
  var body = '';
  response.on('data', function(d) {
    body += d;
  });
  response.on('end', function() {
    // Data reception is done, do whatever with it!
    var categories = JSON.parse(body),
        groups = _.groupBy(categories, 'parent');

    _.map(groups, function (group, key) {
      _.map(group, function(c) {
        var url;
        if (key === 'null') {
          url = '/' + c.name;
        } else {
          var parent = _.find(categories, {id: +key});
          url = '/' + parent.name + '/' + c.name;
        }

        urls.push({ url: url,  changefreq: 'weekly'});
        var d = Q.defer();
        promises.push(d.promise);

        http.get(_.filter([baseUrl, config.apiEndpoint, 'category', c.id, 'photo']).join('/'), function(response) {
          console.log('Got response: ' + response.statusCode);
          var body = '';
          response.on('data', function(d) {
            body += d;
          });
          response.on('end', function() {
            // Data reception is done, do whatever with it!
            var photos = JSON.parse(body);
            photos.map(function(p){
              urls.push({
                url: url + '/photo/' + p.id,
                changefreq: 'monthly',
                img: remapPhoto(p.id)
              });
            });
            d.resolve();
          });
        }).on('error', function(e) {
          console.log('Got error: ' + e.message);
          d.reject(e.message);
        });
      });
    });
    Q.all(promises).then(function() {
      deferred.resolve();
    });
  });
}).on('error', function(e) {
  console.log('Got error: ' + e.message);
  deferred.reject(e.message);
});

deferred.promise.then(function(){
  var sitemap = sm.createSitemap ({
    hostname: config.hostname,
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: urls
  });

  fs.writeFileSync('./app/sitemap.xml', sitemap.toString());
});
