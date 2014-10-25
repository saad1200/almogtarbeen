(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', 'preloaderImageService', 'articlesViewBuilder', portal]);

    function portal(common, articlesService, categoriesService, preloaderImageService, articlesViewBuilder) {
//        var getLogFn = common.logger.getLogFn;
//        var log = getLogFn(controllerId);

        var vm = this;
        vm.viewsGroups = [];
        vm.categories = [];
        vm.selectedArticle = {};

        activate();

        function activate() {
            var promises = [getArticles(), getCategories()];
            common.activateController(promises, controllerId)
                .then(function () { 
//                    log('Activated Dashboard View');
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

        vm.showArticle = function(article){
            vm.selectedArticle = article;
            console.log(vm.selectedArticle.title);
            var modal = document.querySelector( '#articleModal' ),
                close = modal.querySelector( '.md-close'),
                el = document.querySelector( '#article_' + article.id );

            classie.add( modal, 'md-show' );
            var overlay = document.querySelector( '.md-overlay' );
            overlay.removeEventListener( 'click', removeModalHandler );
            overlay.addEventListener( 'click', removeModalHandler );

            function removeModal( hasPerspective ) {
                classie.remove( modal, 'md-show' );

                if( hasPerspective ) {
                    classie.remove( document.documentElement, 'md-perspective' );
                }
            }

            function removeModalHandler() {
                //console.log('dsafdsa');
                removeModal( classie.has( el, 'md-setperspective' ) );
            }

            if( classie.has( el, 'md-setperspective' ) ) {
                setTimeout( function() {
                    classie.add( document.documentElement, 'md-perspective' );
                }, 25 );
            }

            close.addEventListener( 'click', function( ev ) {
                ev.stopPropagation();
                removeModalHandler();
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
                buildGalleryView(data.slice(0,6)),
                buildThreeAndOneView(data.slice(6, 9)),
            ]);
            viewsGroups.push([
                buildThreeAndOneView(data.slice(9, 12)),
                buildThreeAndOneView(data.slice(12, 15))
            ]);

            return viewsGroups;
        }

        function buildGalleryView(articles){
            return {name: 'galleryView', articles: articles}
        }

        function buildThreeAndOneView(articles){
            var threeAndOneView = {name: 'threeAndOneView', articles: []};
            while (articles.length > 0)
                threeAndOneView.articles.push(articles.splice(0, 3));

            return threeAndOneView;
        }
    }
})();