(function () {
    'use strict';

    function getRoutes() {
        return [
            { url: '/', config: {templateUrl: 'app/portal/portal.html'} }
        ];
    }

    function routeConfigurator($routeProvider, routes) {

        routes.forEach(function (r) { $routeProvider.when(r.url, r.config); });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    angular.module('app')
        .constant('routes', getRoutes())
        .config(['$routeProvider', 'routes', routeConfigurator])
        .run();

}());
