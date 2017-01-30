(function (angular, _) {
    angular
        .module('admin.unit')
        .controller('UnitFormController', controller);

    controller.$inject = ['$scope', '$routeParams', '$q', '$timeout', 'UnitFormService'];

    function controller($scope, $routeParams, $q, $timeout, unitFormService) {

        var vm = this;
        /**
         * VM Public
         */
        vm.form = {};
        vm.isEdit = isEdit;
        vm.onRegionSelect = onRegionSelect;
        vm.debounce = null;
        vm.debounceTime = 300;

        init();

        /**
         * @constructor
         */
        function init() {
            setDefaultFormData();
            setFormMode();

            getFormData();
        }

        function setFormMode() {
            if (_.isNumber($routeParams.id)) {
                vm.form.id = routeParams.id;
                vm.form.mode = 'update';
            }
        }

        function setDefaultFormData() {
            vm.form = {
                id: -1,
                mode: 'create',
                data: {
                    types: [],
                    regions: [],
                    cities: []
                },
                input: {
                    type: null,
                    name: null,
                    region: null,
                    citiy: null
                }
            };
        }

        function getFormData() {
            unitFormService.getDataSync()
                .then(function (response) {
                    // clear city cache
                    unitFormService.clearCache('cities');
                    vm.form.data = unitFormService.data;
                    
                    // Edit data
                    getUnitData();
                });
        }

        function getUnitData() {
            if (isEdit()) {
                //EDIT MODE
            }
        }

        function isEdit() {
            return vm.id != -1;
        }

        /**
         * @events
         */

        function onRegionSelect() {
            $timeout.cancel(vm.debounce);
            vm.debounce = $timeout(function () {
                vm.form.input.city = null;
                if (!_.isEmpty(vm.form.input.region)) {
                    unitFormService.getCities(vm.form.input.region);
                }
            }, vm.debounceTime)
        }
    }

})(angular, _);