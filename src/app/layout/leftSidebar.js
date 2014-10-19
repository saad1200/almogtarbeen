(function(){
    'use strict'

    angular.module('app').controller('leftSidebar', ['$scope', 'broadcaster', leftSideBar]);

    function leftSideBar($scope, broadcaster){

        var vm = this;
        vm.threeView = [];
        vm.highlightView = [];
        vm.listView = [];

        var removeOnUpdateArticlesViews = broadcaster.onUpdateArticlesViews(function(event, data){
            while (data.length > 0)
                vm.threeView.push(data.splice(0, 4));
                vm.threeView.push(data.splice(4, 8));
                vm.threeView.push(data.splice(8, 12));
        });

        $scope.$on('$destroy', function(){
            removeOnUpdateArticlesViews();
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