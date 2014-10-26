(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app
        .config(['$routeProvider', 'routes', '$httpProvider', 'localStorageServiceProvider', routeConfigurator])
        .run(['$location', '$route', run]);

    function run($location, $route) {
    }

    function routeConfigurator($routeProvider, routes, $httpProvider, localStorageServiceProvider) {
        //localStorageServiceProvider.setPrefix('almogtarbeen');
        //$httpProvider.interceptors.push('localStorageHttpInterceptor');
        routes.forEach(function (r) { $routeProvider.when(r.url, r.config); });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    function getRoutes() {
        return [
            {
                url: '/:id?',
                config: {
                    templateUrl: 'app/portal/portal.html',
                    title: 'portal',
                    settings: {}
                }
            }, {
                url: '/article/:id',
                config: {
                    title: 'search',
                    templateUrl: 'app/article/article.html',
                    settings: {}
                }
            }
        ];
    }

    app.service('localStorageHttpInterceptor', function($q, localStorageService) {

        function canRecover(config){
            return localStorageService.get(config.url) !== null;
        }
        return {
            'request': function(config) {
                return config;
            },

            'requestError': function(rejection) {
                if (canRecover(rejection)) {
                    return responseOrNewPromise
                }
                return $q.reject(rejection);
            },

            'response': function(response) {
                if(/www.almogtarbeen.com/.test(response.config.url))
                {
                    if(localStorageService.get(response.config.url) === null)
                    {
                        localStorageService.set(response.config.url, response);
                    }

                }
                return response;
            },

            'responseError': function(rejection) {
                if (canRecover(rejection.config)) {
                    return localStorageService.get(rejection.config.url);
                }
                return $q.reject(rejection);
            }
        };
    });
})();
