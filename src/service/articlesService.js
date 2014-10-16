(function () {
    'use strict';

    angular.module('app').service('articlesService', ['$http', articlesService]);

    function articlesService($http){

        this.getLatest = function(){
            return $http.get('http://www.almogtarbeen.com/articles/getArticles?size=30&notCategoies=(17,5)');
        }
    }

})();