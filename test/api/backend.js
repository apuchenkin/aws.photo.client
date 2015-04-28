'use strict';

angular
  .module('aws.photo.mock', [
    'ngMockE2E',
    'aws.config'
  ])
  .run(['$httpBackend', '$http', 'CONFIG', function ($httpBackend, $http, config) {

    var category = [
      {
        id: 1,
        name: 'test',
        parent: null
      },
      {
        id: 2,
        name: 'sub1',
        parent: 1
      },
      {
        id: 3,
        name: 'sub2',
        parent: 1
      }
    ];

    var photo = [{
      id: 1,
      width: 2048,
      height: 1365,
      src: '/static/gallery/DSCF2134.jpg',
      thumb: '/static/thumb/DSCF2134.jpg',
      name: 'test',
      parentId: null,
      author: 'LKjgsdg Kjhsdg',
      views: 0
    }, {
      id: 2,
      width: 1365,
      height: 2048,
      src: '/static/gallery/DSCF2152.jpg',
      thumb: '/static/thumb/DSCF2152.jpg',
      name: 'test',
      parentId: null,
      author: 'Lskdgh Vfkjsdhg',
      views: 0
    }];

    var translation = [
      {
        id: 1,
        type: 'category',
        language: 'en',
        refId: 1,
        field: 'title',
        value: 'Test category'
      },
      {
        id: 2,
        type: 'category',
        language: 'en',
        refId: 2,
        field: 'title',
        value: 'Subcategory'
      },
      {
        id: 3,
        type: 'category',
        language: 'en',
        refId: 3,
        field: 'title',
        value: 'This category might exists'
      },

      // photo
      {
        id: 1001,
        type: 'photo',
        language: 'en',
        refId: 1,
        field: 'caption',
        value: 'Some description of the exposed photo'
      },
      {
        id: 1002,
        type: 'photo',
        language: 'en',
        refId: 2,
        field: 'caption',
        value: 'This description is so long that cannot be fitted on single line, this case two text lines will be used, or even more...'
      }
    ];

    $httpBackend.whenGET(config.apiEndpoint + '/category').respond(function () {
      return [200, category];
    });

    $httpBackend.whenGET(new RegExp(config.apiEndpoint + '\/photo?.*')).respond(function () {
      return [200, photo];
    });

    $httpBackend.whenGET(new RegExp(config.apiEndpoint + '\/translation.*')).respond(function () {
      return [200, translation];
    });

    $httpBackend.whenGET(/^static\//).passThrough();
    $httpBackend.whenGET(/^views\//).passThrough();
  }])
;

