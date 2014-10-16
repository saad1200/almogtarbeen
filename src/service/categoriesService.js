(function () {
    'use strict';

    angular.module('app').service('categoriesService', ['$http', articlesService]);

    function articlesService($http){

        this.getAll = function(){
            return $http.get('http://www.almogtarbeen.com/categories/getall');
        }
    }

})();