(function(){

    angular.module('app').controller('leftSidebar', ['writersService', leftSideBar]);

    function leftSideBar(writersService){

        var vm = this;
        vm.writers = [];

        writersService.getLatest().success(function(results){
            vm.writers = results;
        });
    }
})();

(function(){

    angular.module('app').service('writersService', ['$http', writersService]);

    function writersService($http){

        this.getLatest = function(){
          return $http.get('http://www.almogtarbeen.com/writers/getLatest?size=5q');
        };
    }

})();