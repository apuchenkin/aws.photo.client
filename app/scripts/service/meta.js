'use strict';

angular.module('aws.photo.client')
  .service('aws.service.meta', ['CONFIG', '$rootScope', '$translate', function (config, $rootScope, $translate) {
    var
      defaults = {
        title: config.meta.name + ' - ' + $translate.instant('DESCRIPTION')
      },
      meta = {},

      clean = function () {
        meta.keywords = [];
        meta.description = '';
        meta.title = defaults.title;
      },

      setKeywords = function (list) {
        meta.keywords = list;
        $rootScope.meta.keywords = getKeywords();
      },

      setDescription = function (description) {
        meta.description = description;
        $rootScope.meta.description = getDescription();
      },

      setTitle = function (title) {
        meta.title = title + ' - ' + config.meta.name;
        $rootScope.meta.title = getTitle();
      },

      getTitle = function () {
        return meta.title;
      },

      getKeywords = function () {
        return meta.keywords.join(',');
      },

      getDescription = function () {
        return meta.description;
      }
      ;

    // public API exposed here
    return {
      clean: clean,
      getKeywords: getKeywords,
      getDescription: getDescription,
      getTitle: getTitle,
      setKeywords: setKeywords,
      setDescription: setDescription,
      setTitle: setTitle
    };
  }]
);
