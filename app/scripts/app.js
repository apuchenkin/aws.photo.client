'use strict';

/**
 * @ngdoc overview
 * @name photoawesomestuffinApp
 * @description
 * # photoawesomestuffinApp
 *
 * Main module of the application.
 */
angular
  .module('photoawesomestuffinApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'wu.masonry'
  ])
  .config(function ($urlRouterProvider) {
    // when there is an empty route, redirect to /
    $urlRouterProvider.when('', '/');
  })

  .config(['$stateProvider', function ($stateProvider) {

    // Public routes
    $stateProvider
      .state('public', {
        abstract: true,
        template: '<ui-view></ui-view>'
      })
      .state('public.404', {
        url: '/404/',
        templateUrl: '404'
      });

    // Abstract error page
    $stateProvider
      .state('error', {
        abstract: true,
        url: '/error',
        templateUrl: 'views/error.html'
      });

    //main routes
    $stateProvider
      .state('main', {
        abstract: true,
        template: '<ui-view></ui-view>'
      })
      .state('main.home', {
        url: '/',
        title: 'Home',
        templateUrl: 'views/gallery.html',
        controller: 'AboutCtrl'
      })
      .state('main.home.image', {
        url: ':id',
        controller: 'ImageCtrl',
        templateUrl: 'views/image.html'
      })
    ;
  }])

  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(false);
  }])
  //
  //.config(function ($routeProvider) {
  //  $routeProvider
  //    .when('/', {
  //      templateUrl: 'views/story.html',
  //      controller: 'MainCtrl'
  //    })
  //    .when('/about', {
  //      templateUrl: 'views/gallery.html',
  //      controller: 'AboutCtrl'
  //    })
  //    .otherwise({
  //      redirectTo: '/'
  //    });
  //})
  .directive('colorbox', function() {
  return {
    restrict: 'AC',
    link: function (scope, element, attrs) {
      $(element).colorbox(attrs.colorbox);
    }
  };
});
