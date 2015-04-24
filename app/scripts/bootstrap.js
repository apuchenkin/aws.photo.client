'use strict';

(function() {
  angular.element(document).ready(function () {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('/config.json').then(
      function (response) {
        angular.module('aws.config', []).constant('CONFIG', response.data);
        angular.element(document).ready(function() {
          angular.bootstrap(document, ['aws.photo.client']);
        });
      }
    );
  });
})();