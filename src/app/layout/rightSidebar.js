(function(){

    angular.module('app').controller('rightSidebar', ['articlesService', 'preloaderImageService', rightSidebar]);

    function rightSidebar(articlesService, preloaderImageService){

        var vm = this;
        vm.writersArticles = [];

        articlesService.getLatest().then(function (result) {
            var imagesToPreload = [];
            for(var index in result.data)
                imagesToPreload.push(result.data[index].pictures);

            preloaderImageService.preloadImages( imagesToPreload ).then(
                function handleResolve( imageLocations ) {
                    vm.writersArticles = result.data.slice(12,24);
                });

            return vm.articles ;
        });
    }
})();