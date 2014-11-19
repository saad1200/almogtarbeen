(function () {
    'use strict';

    angular.module('app').service('articlesService', ['$http', articlesService]);

    function articlesService($http){

        this.getByCountryCode = function(code){
            return $http.get('http://www.almogtarbeen.com/articles/getByCountryCode?size=31&code=' + code);
        }

        this.getLatest = function(){
            return $http.get('http://www.almogtarbeen.com/articles/get?size=31&notCategoies=(17,5)');
        }

        this.get = function(id){
            return $http.get('http://www.almogtarbeen.com/article/get/' + id);
        }

        this.getArticleByCountryCode = function(id, code){
            return $http.get('http://www.almogtarbeen.com/article/getByCountryCode/' + id + '/?code=' + code);
        }
    }

})();