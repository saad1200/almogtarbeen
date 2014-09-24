(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', portal]);

    function portal(common, articlesService, categoriesService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.articles = [];
        vm.categories = [];

        activate();

        function activate() {
            var promises = [getArticles(), getCategories()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getArticles() {
            return articlesService.getAll().then(function (result) {
                vm.articles = result.data;
                return vm.articles ;
            });
        }
        
        function getCategories(){
            return categoriesService.getAll().then(function (result) {
                vm.categories = result.data;
                return vm.categories ;
            });
        }
    }
    
})();

(function () {
    'use strict';
    
    angular.module('app').service('articlesService', ['$http', articlesService]);
    
    function articlesService($http){
        
        this.getAll = function(){
            return $http.get('http://www.almogtarbeen.com/articles/getArticles?size=10');
        }
    }
    
})();
    
(function () {
    'use strict';
    
    angular.module('app').service('categoriesService', ['$http', articlesService]);
    
    function articlesService($http){
        
        this.getAll = function(){
            return $http.get('http://www.almogtarbeen.com/categories/getall');
        }
    }
    
})();
    