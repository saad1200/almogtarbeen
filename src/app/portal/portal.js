(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', portal]);

    function portal(common, articlesService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.articles = [];

        activate();

        function activate() {
            var promises = [getArticles()];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getArticles() {
            return articlesService.getAll().then(function (result) {
                vm.articles = result.data;
                return vm.articles ;
            });
        }
    }
    
})();

(function () {
    'use strict';
    
    angular.module('app').service('articlesService', ['$http', articlesService]);
    
    function articlesService($http){
        
        this.getAll = function(){
            return $http.get('http://www.almogtarbeen.com/articles/getLatest/0');
        }
    }
    
})();
    