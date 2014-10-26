(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', 'preloaderImageService', 'articlesViewBuilder', 'articleModal', 'spinner', portal]);

    function portal(common, articlesService, categoriesService, preloaderImageService, articlesViewBuilder, articleModal, spinner) {
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
                vm.viewsGroups = articlesViewBuilder.build(result.data);
                var imagesToPreload = [];

                for(var index in result.data)
                    imagesToPreload.push(result.data[index].pictures);

                preloaderImageService.preloadImages( imagesToPreload ).then(
                    function handleResolve( imageLocations ) {
                        //vm.viewsGroups = articlesViewBuilder.build(result.data);
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

        vm.showArticle = function(id){
            spinner.spinnerShow();
            articlesService.get(id).success(function(article){
                vm.selectedArticle = article;
                articleModal.show(article);
                spinner.spinnerHide();
            });
        }
    }
    
})();

(function(){
    'use strict'

    angular.module('app').service('articleModal', articleModal);

    function articleModal(){

        function getMessage(article){
            var message = '<h3>' + article.formattedTitle + '</h3>';

            if(article.pictures.length > 0)
            {
                message += '<img src="' + article.pictures[0] + '" alt="' + article.title + '" class="img-responsive thumbnail"/>';
            }

            message += '<div> <p class="newspaper">' + article.content + '</p></div>';

            return message;
        }

        this.show = function(article){
            bootbox.dialog({
                onEscape: true,
                animate: true,
                message: getMessage(article),
            });

            $(".bootbox").click(function(ev){
                if(ev.target != this) return;
                $('.bootbox').modal('hide');
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