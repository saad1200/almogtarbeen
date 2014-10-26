(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', 'preloaderImageService', 'articlesViewBuilder', 'articleModal','$routeParams', portal]);

    function portal(common, articlesService, categoriesService, preloaderImageService, articlesViewBuilder, articleModal,$routeParams) {
//        var getLogFn = common.logger.getLogFn;
//        var log = getLogFn(controllerId);

        var vm = this;
        vm.viewsGroups = [];
        vm.categories = [];
        vm.selectedArticle = {};

        activate();

        function activate() {

            articleModal.close();
            var promises = [getCategories()];
            var id = $routeParams.id || null;
            if(id !== null){
                promises.push(getArticle(id));
            }
            var code = $routeParams.code || null;
            if(code !== null){
                promises.push(getByCountryCode(code));
            }else{
                promises.push(getArticles());
            }
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Dashboard View');
            });
        }

        function getArticle(id){
            articlesService.get(id).success(function(article){
                vm.selectedArticle = article;
                articleModal.show(article);
            });
        }

        function getByCountryCode(code){
            return getArticlesByPromise(articlesService.getByCountryCode(code));
        }

        function getArticles() {
            return getArticlesByPromise(articlesService.getLatest());
        }

        function getArticlesByPromise(promise){
            return promise.then(function (result) {
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

        vm.showArticle = function(id){
            console.log(vm.selectedArticle);
            if(vm.selectedArticle && vm.selectedArticle.id === id)
            {
                articlesService.get(id).success(function(article){
                    vm.selectedArticle = article;
                    articleModal.show(article);
                });
            }
        }
    }
    
})();

(function(){
    'use strict'

    angular.module('app').service('articleModal', articleModal);

    function articleModal(){

        var self = this;
        this.close = function(){
            $('.bootbox').modal('hide');
        }

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
                message: getMessage(article)
            });

            $(".bootbox").click(function(ev){
                if(ev.target != this) return;
                self.close();
            });
        }
    }
})();
    
(function(){
    'use strict'
    
    angular.module('app').service('articlesViewBuilder',articlesViewBuilder);
    
    function articlesViewBuilder(){
        var hasMenue = true;
        this.build = function(data){
            var viewsGroups = [];

            viewsGroups.push([
                buildGalleryView(data.slice(0,6)),
                buildThreeAndOneView(data.slice(6, 9), hasMenue),
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

        function buildThreeAndOneView(articles, hasMenue){
            var threeAndOneView = {name: 'threeAndOneView', articles: [], hasMenue: hasMenue};
            while (articles.length > 0)
                threeAndOneView.articles.push(articles.splice(0, 3));

            return threeAndOneView;
        }
    }
})();