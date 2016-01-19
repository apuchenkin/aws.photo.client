'use strict';

var
  _ = require('lodash'),
  sm = require('sitemap'),
  fs = require('fs'),
  http = require('http'),
  Q = require('q'),
  Hashes = require('jshashes'),
  config = require('./app/config/production.json'),
  urls = [],
  promises = [],
  baseUrl = config.hostname,
  sha = new Hashes.SHA1(),
  w = 1200,
  h = 900
;

var deferred = Q.defer();
var remapPhoto = function (id) {
  var sign = sha.hex_hmac(config.secret, id + '-' + w + 'x' + h);
  return [config.apiEndpoint, 'hs/photo', id, w, h, sign].join('/');
};

var genLinks = function(url) {
  return [
    {lang: 'x-default', url: url},
    {lang: 'ru', url: '/ru' + url},
    {lang: 'en', url: '/en' + url}
  ];
};

urls.push({ url: '/', changefreq: 'monthly', priority: 1, links: genLinks('/')});
_.map(config.static, function(s){
  urls.push({ url: '/' + s,  changefreq: 'monthly', priority: 0.5, links: genLinks('/' + s)});
});

http.get(
  {
    host: 'proxy02.merann.ru',
    port: 8080,
    path: _.filter([baseUrl, config.apiEndpoint, 'category']).join('/')
  }, function(response) {
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
          urls.push({ url: url,  changefreq: 'weekly', priority: 0.8, links: genLinks(url)});
        } else {
          var parent = _.find(categories, {id: +key});
          url = '/' + parent.name + '/' + c.name;
          urls.push({ url: url,  changefreq: 'weekly', priority: 0.6, links: genLinks(url)});
        }

        var d = Q.defer();
        promises.push(d.promise);

        http.get(
          {
            host: 'proxy02.merann.ru',
            port: 8080,
            path: _.filter([baseUrl, config.apiEndpoint, 'category', c.id, 'photo']).join('/')
          },
          function(response) {
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
                priority: 0.4,
                img: baseUrl + remapPhoto(p.id),
                links: genLinks(url + '/photo/' + p.id)
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
