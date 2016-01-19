'use strict';

angular.module('aws.photo.core')
  .service('aws.service.photo', ['CONFIG', function (config) {
    var
      sha = new Hashes.SHA1(),
      b64 = new Hashes.Base64(),

      succ = function (val) { return ++val; },

      refinePhotos = function (photos) {
        var groups = _.groupBy(photos, 'group'),
          data = _.reduce(_.keys(groups), function (acc, i) {
            if (+i > 0) {
              var items = groups[i],
                views = _.map(items, 'views'),
                probs = _.map(views, succ),
                index = weightedRandom(probs),
                photo = items[index];

              photo.views = _.sum(views);
              acc.push(photo);
            }
            return acc;
          }, groups.null);

        data = _.sortBy(data, 'datetime');
        data.raw = photos;
        return data;
      },

      weightedRandom = function (probabilities) {
        var probabilitiesMap = _.reduce(probabilities, function (acc, v) {
            acc.push(v + (acc.length ? acc[acc.length - 1] : 0));
            return acc;
          }, []),
          pointer = math.random(probabilitiesMap[probabilitiesMap.length - 1]);

        return _.reduce(probabilitiesMap, function (acc, v) {
          return pointer <= v ? acc : ++acc;
        }, 0);
      },

      remapImage = function (src, w, h) {
        var hash = b64.encode(src),
          sign = sha.hex_hmac(config.secret, hash + '-' + w + 'x' + h);
        return [config.apiEndpoint, 'hs/image', hash, w, h, sign].join('/');
      },

      remapPhoto = function (id, w, h) {
        var sign = sha.hex_hmac(config.secret, id + '-' + w + 'x' + h);
        return [config.apiEndpoint, 'hs/photo', id, w, h, sign].join('/');
      };

    // public API exposed here
    return {
      remapPhoto: remapPhoto,
      remapImage: remapImage,
      weightedRandom: weightedRandom,
      refinePhotos: refinePhotos
    };
  }]
);
