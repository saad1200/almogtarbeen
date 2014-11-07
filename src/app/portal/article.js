(function () {
    'use strict';
    
    var controllerId = 'article';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'preloaderImageService','$routeParams', 'articleView', article]);

    function article(common, articlesService, preloaderImageService, $routeParams, articleView) {
//        var getLogFn = common.logger.getLogFn;
//        var log = getLogFn(controllerId);

        var vm = this;
        vm.articles = [];
        vm.selectedArticle = {};
        vm.suburl = 'articles'

        activate();

        function activate() {

            var promises = [];
            var id = $routeParams.id || null;
            var code = $routeParams.code || null;
            if(code !== null){
                if(id !== null){
                    promises.push(getArticleByCountryCode(id, code));
                }
                vm.suburl = 'country/' + code;
                promises.push(getByCountryCode(code));
            }else{
                if(id !== null){
                    promises.push(getArticle(id));
                }
                promises.push(getArticles());
            }
            common.activateController(promises, controllerId)
                .then(function () {
                    //log('Activated Dashboard View');
            });
        }

        function getArticleByCountryCode(id, code){
            articlesService.getArticleByCountryCode(id, code).success(function(article){
                vm.selectedArticle = article;
            });
        }

        function getArticle(id){
            articlesService.get(id).success(function(article){
                articleView.show();
                vm.selectedArticle = article;
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
                        vm.articles =  result.data;
                    });

                return result.data;
            });
        }

    }
    
})();

(function(){
    'use strict'

    angular.module('app').service('articleView', articleView);

    function articleView(){

        var self = this;

        this.show = function() {
            $('#content').bind('resize', function(){
                console.log($('#content'));
            });
            $('#content').click(function(){
                $(this).parent().resize();
            });

            console.log(document.getElementById('content').offsetHeight);
            console.log(document.getElementById('content').clientHeight);
            //var prevHeight = $('#content').height();
            //console.log($('#content'));
            //$('#content').resize( function (e) {
            //        var curHeight = $(this).height();
            //        if (prevHeight !== curHeight) {
            //            console.log('height changed from ' + prevHeight + ' to ' + curHeight);
            //
            //            prevHeight = curHeight;
            //        }
            //    }
            //);
        }
    }
})();
