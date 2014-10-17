(function(){
    'user strict'

    angular.module('app').factory('broadcaster', ['$rootScope', broadcaster]);

    function broadcaster($rootScope){

        var updateArticlesViewsName = 'updateArticlesViews'
        function updateArticlesViews(articles){
            $rootScope.$broadcast(updateArticlesViewsName, articles)
        }

        function onUpdateArticlesViews(func){
            $rootScope.$on(updateArticlesViewsName, func)
        }

        return {
            updateArticlesViews : updateArticlesViews,
            onUpdateArticlesViews : onUpdateArticlesViews
        }
    }

})();