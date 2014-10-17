(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', 'galleryView', 'preloaderImageService', 'broadcaster', portal]);

    function portal(common, articlesService, categoriesService, galleryView, preloaderImageService, broadcaster) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.articles = [];
        vm.articlesList = [];
        vm.slids = [];
        vm.categories = [];
        vm.pictures = ['http://malsup.github.com/images/beach1.jpg']
        vm.isLoading = true;
        vm.isSuccessful = false;
        vm.percentLoaded = 0;
        
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
                        vm.articles = result.data.slice(0,12);
                        vm.articlesList = result.data.slice(24,30);
                        broadcaster.updateArticlesViews(result.data.slice(12, 16))
                        galleryView.refresh();
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
        
        function preloadImages(preloadImages){
            preloader.preloadImages( preloadImages ).then(
                function handleResolve( imageLocations ) {
                    vm.isLoading = false;
                    vm.isSuccessful = true;
                },
                function handleReject( imageLocation ) {
                    vm.isLoading = false;
                    vm.isSuccessful = false;
                },
                function handleNotify( event ) {
                    vm.percentLoaded = event.percent;
                }
            );
        }
    }
    
})();
    