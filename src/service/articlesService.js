(function () {
    'use strict';

    angular.module('app').service('articlesService', ['$http', articlesService]);

    function articlesService($http){

        this.getByCountryCode = function(code){
            console.log('http://www.almogtarbeen.com/articles/getByCountryCode?size=16&code=' + code);
            return $http.get('http://www.almogtarbeen.com/articles/getByCountryCode?size=16&code=' + code);
        }

        this.getLatest = function(){
            return $http.get('http://www.almogtarbeen.com/articles/get?size=16&notCategoies=(17,5)');
        }

        this.get = function(id){
            return $http.get('http://www.almogtarbeen.com/article/get/' + id);
        }

        this.getArticleByCountryCode = function(id, code){
            return $http.get('http://www.almogtarbeen.com/article/getByCountryCode/' + id + '/?code=' + code);
        }
    }

})();