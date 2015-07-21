'use strict';

angular
  .module('aws.photo.core', [
    'aws.config',
    'restmod'
  ])

  .factory('restmodConfig', ['restmod', 'inflector', 'CONFIG', function (restmod, inflector, config) {
    return restmod.mixin('DefaultPacker', { // include default packer extension
      $config: {
        style: 'AMSApi', // By setting the style variable the warning is disabled.
        primaryKey: 'id',
        urlPrefix: config.apiEndpoint
      },
      $extend: {
        Model: {
          encodeUrlName: inflector.parameterize,
          unpack: function (_resource, _raw) {
            return _raw;
          }
        }
      }
    });
  }])

  .config(['restmodProvider', function (restmodProvider) {
    restmodProvider.rebase('restmodConfig');
  }])
;
