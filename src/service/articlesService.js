(function () {
    'use strict';

    angular.module('app').service('articlesService', ['$http', articlesService]);

    function articlesService($http){

        this.getLatest = function(){
            return $http.get('http://www.almogtarbeen.com/articles/getArticles?size=22&notCategoies=(17,5)');
        }

        this.get = function(id){
            return $http.get('http://www.almogtarbeen.com/article/get/' + id);
        }
    }

})();