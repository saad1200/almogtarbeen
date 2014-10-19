(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', 'preloaderImageService', 'articlesViewBuilder', portal]);

    function portal(common, articlesService, categoriesService, preloaderImageService, articlesViewBuilder) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.viewsGroups = [];
        vm.categories = [];

        activate();

        function activate() {
            var promises = [getArticles(), getCategories()];
            common.activateController(promises, controllerId)
                .then(function () { 
                    log('Activated Dashboard View'); 
            });
        }

        function getArticles() {
            return articlesService.getLatest().then(function (result) {
                var imagesToPreload = [];
                for(var index in result.data)
                    imagesToPreload.push(result.data[index].pictures);

                preloaderImageService.preloadImages( imagesToPreload ).then(
                    function handleResolve( imageLocations ) {
                        vm.viewsGroups = articlesViewBuilder.build(result.data);
                });
                
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
    
(function(){
    'use strict'
    
    angular.module('app').service('articlesViewBuilder',articlesViewBuilder);
    
    function articlesViewBuilder(){
        this.build = function(data){
            var viewsGroups = [];

            viewsGroups.push([
                buildThreeAndOneView(data.slice(6, 10)),
                buildGalleryView(data.slice(0,6))
            ]);
            viewsGroups.push([
                buildThreeAndOneView(data.slice(14, 18)),
                buildThreeAndOneView(data.slice(18, 23))
            ]);

            console.log(viewsGroups);
            return viewsGroups;
        }

        function buildGalleryView(articles){
            return {name: 'galleryView', articles: articles}
        }

        function buildThreeAndOneView(articles){
            var threeAndOneView = {name: 'threeAndOneView', articles: []};
            while (articles.length > 0)
                threeAndOneView.articles.push(articles.splice(0, 4));

            return threeAndOneView;
        }
    }
})();