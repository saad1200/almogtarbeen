(function () {
    'use strict';
    
    var controllerId = 'article';
    angular.module('app').controller(controllerId, ['common', 'articleService', '$routeParams', '$sce', article]);

    function article(common, articleService, $routeParams, $sce) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.article = null;

        activate();

        function activate() {
            var id = $routeParams.id || '';
            var promises = [getArticle(id)];
            common.activateController(promises, controllerId)
                .then(function () { log('Activated Dashboard View'); });
        }

        function getArticle(id) {
            return articleService.get(id).then(function (result) {
                vm.article = result.data;
                console.log(vm.article);
                return vm.article ;
            });
        }
    }
    
})();

(function () {
    'use strict';
    
    angular.module('app').service('articleService', ['$http', articleService]);
    
    function articleService($http){
        
        this.get = function(id){
            return $http.get('http://www.almogtarbeen.com/article/get/' + id);
        }
    }
    
})();