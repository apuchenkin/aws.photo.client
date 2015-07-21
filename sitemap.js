var
  _ = require('lodash'),
  sm = require('sitemap'),
  fs = require('fs'),
  http = require('http'),
  Q = require('q'),
  config = require('./app/config/production.json'),
  urls = [
    { url: '/',  changefreq: 'monthly'}
  ],
  promises = [],
  hostname = 'http://photo.awesomestuff.in'
;

_.map(config.static, function(s){
  urls.push({ url: '/' + s,  changefreq: 'monthly'});
});

var deferred = Q.defer();

http.get([hostname, config.apiEndpoint, 'category'].join('/'), function(response) {
  console.log("Got response: " + response.statusCode);
  var body = '';
  response.on('data', function(d) {
    body += d;
  });
  response.on('end', function() {
    // Data reception is done, do whatever with it!
    var categories = JSON.parse(body);
    categories.map(function(c){
      urls.push({ url: '/' + c.name,  changefreq: 'weekly'});
      var d = Q.defer();
      promises.push(d.promise);

      http.get([hostname, config.apiEndpoint, 'category', c.id, 'photo'].join('/'), function(response) {
        console.log("Got response: " + response.statusCode);
        var body = '';
        response.on('data', function(d) {
          body += d;
        });
        response.on('end', function() {
          // Data reception is done, do whatever with it!
          var photos = JSON.parse(body);
          photos.map(function(p){
            urls.push({ url: '/' + c.name + '/photo/' + p.id,  changefreq: 'monthly'});
          });
          d.resolve();
        });
      }).on('error', function(e) {
        console.log("Got error: " + e.message);
        d.reject(e.message);
      });
    });
    Q.all(promises).then(function() {
      deferred.resolve();
    });
  });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
  deferred.reject(e.message);
});

deferred.promise.then(function(){
  var sitemap = sm.createSitemap ({
    hostname: hostname,
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: urls
  });

  fs.writeFileSync("./app/sitemap.xml", sitemap.toString());
});
