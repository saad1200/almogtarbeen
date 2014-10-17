(function(){
    'use strict'

    angular.module('app').controller('leftSidebar', ['writersService', 'broadcaster', leftSideBar]);

    function leftSideBar(writersService, broadcaster){

        var vm = this;
//        vm.writers = [];
//        vm.writersArticles = [];
        vm.threeView = [];
        vm.highlightView = [];
        vm.listView = [];

        writersService.getLatest().success(function(results){
            vm.writers = results;
        });

        broadcaster.onUpdateArticlesViews(function(event, data){
            while (data.length > 0)
                vm.threeView.push(data.splice(0, 4));
//            vm.threeView.push(data);
//            vm.highlightView = data.slice(15, 16);
//            vm.listView = data.slice(15, 20);
        });
//        writersService.getArticles().then(function (result) {
//            var imagesToPreload = [];
//            for(var index in result.data)
//                imagesToPreload.push(result.data[index].pictures);
//
//            preloaderImageService.preloadImages( imagesToPreload ).then(
//                function handleResolve( imageLocations ) {
//                    vm.writersArticles = result.data;
//                });
//
//            return vm.articles ;
//        });
    }
})();

(function(){

    angular.module('app').service('writersService', ['$http', writersService]);

    function writersService($http){

        this.getLatest = function(){
          return $http.get('http://www.almogtarbeen.com/writers/getLatest?size=5q');
        };

        this.getArticles = function(){
            return $http.get('http://www.almogtarbeen.com/articles/getArticles?size=8&categories=(17,5)');
        }
    }

})();