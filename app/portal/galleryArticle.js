(function () {
    'use strict';

    var controllerId = 'galleryArticle';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'preloaderImageService','$routeParams', 'articleView', galleryArticle]);

    function galleryArticle(common, articlesService, preloaderImageService, $routeParams, articleView) {
    }

})();