(function(){

    angular.module('app').controller('leftSidebar', ['writersService', 'preloaderImageService', leftSideBar]);

    function leftSideBar(writersService, preloaderImageService){

        var vm = this;
        vm.writers = [];
        vm.writersArticles = [];

        writersService.getLatest().success(function(results){
            vm.writers = results;
        });

        writersService.getArticles().then(function (result) {
            var imagesToPreload = [];
            for(var index in result.data)
                imagesToPreload.push(result.data[index].pictures);

            preloaderImageService.preloadImages( imagesToPreload ).then(
                function handleResolve( imageLocations ) {
                    vm.writersArticles = result.data;
                });

            return vm.articles ;
        });
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