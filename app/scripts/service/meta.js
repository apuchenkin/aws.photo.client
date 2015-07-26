'use strict';

angular.module('aws.photo.client')
  .service('aws.service.meta', ['CONFIG', '$rootScope', '$translate', function (config, $rootScope, $translate) {
    var
      defaults = {
        title: config.meta.name + ' - ' + $translate.instant('DESCRIPTION'),
        description: $translate.instant('META_DESCRIPTION')
      },
      meta = {},

      clean = function () {
        meta.keywords = [];
        meta.description = defaults.description;
        meta.title = defaults.title;
      },

      setKeywords = function (list) {
        meta.keywords = list;
        $rootScope.meta.keywords = getKeywords();
      },

      setDescription = function (description) {
        //Author: A.N. Author, Illustrator: P. Picture, Category: Books, Price:  £9.24, Length: 784 pages
        meta.description = description || defaults.description;
        $rootScope.meta.description = getDescription();
      },

      setTitle = function (title) {
        meta.title = title
          ? title + ' - ' + config.meta.name
          : defaults.title;

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
