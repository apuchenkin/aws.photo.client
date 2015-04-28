'use strict';

(function() {
  angular.element(document).ready(function () {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('/config.json').then(
      function (response) {
        angular.module('aws.config', []).constant('CONFIG', response.data);
        angular.element(document).ready(function() {
          var modules =  ['aws.photo.client'];
          if (response.data.test) {
            modules.push('aws.photo.mock');
          }

          angular.bootstrap(document, modules);
        });
      }
    );
  });
})();
