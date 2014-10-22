(function () { 
    'use strict';
    
    var controllerId = 'shell';
    angular.module('app').controller(controllerId,
        ['$rootScope', 'common', 'config', shell]);

    function shell($rootScope, common, config) {
        var vm = this;
        var logSuccess = common.logger.getLogFn(controllerId, 'success');
        var events = config.events;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.spinnerOptions = {
            radius: 55,
            lines: 12,
            length: 0,
            width: 30,
            speed: 1.0,
            corners: 1.0,
            trail: 66,
            color: '#4f8edc',
            opacity: 0
        };

        activate();

        function activate() {
//            logSuccess('Almogtarbeen loaded!', null, true);
            common.activateController([], controllerId);
        }

        function toggleSpinner(on) {
            vm.isBusy = on;
            vm.busyMessage = '';
        }

        $rootScope.$on('$routeChangeStart',
            function () {
                 toggleSpinner(true);
            }
        );
        
        $rootScope.$on(events.controllerActivateSuccess,
            function () {
                 toggleSpinner(false);
            }
        );

        $rootScope.$on(events.spinnerToggle,
            function (data) {
                 toggleSpinner(data.show);
            }
        );

    }

})();