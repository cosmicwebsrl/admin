(function (angular, _) {
    angular
        .module('admin.unit')
        .controller('UnitServicesController', controller);

    controller.$inject = ['UnitServicesService', 'unitServices', 'BaseService'];

    function controller(unitServicesService, unitServices, bs) {

        var vm = this;
        /**
         * VM Public
         */
        vm.form = {};
        vm.isChecked = isChecked;
        vm.toggleCheck = toggleCheck;
        vm.printChecked = printChecked;
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
            if (bs.isEditMode()) {
                vm.form.id = bs.getEditID();
                vm.form.mode = 'update';
            }
        }


        function setDefaultFormData() {
            unitServices.reset();

            vm.form = {
                id: -1,
                data: {},
                input: unitServices
            }
        }

        function getFormData() {
            unitServicesService.getDataSync()
                .then(function (response) {
                    vm.form.data = unitServicesService.data;
                });
        }

        function isChecked(id, asIndex) {
            var index = unitServices.checks.indexOf(id);
            return asIndex ? index : index !== -1;
        }

        function toggleCheck(id) {
            var index = isChecked(id, true);
            if (isChecked(id)) {
                // uncheck
                unitServices.checks.splice(index, 1);
            } else {
                unitServices.checks.push(id);
            }
        }

        // dev
        function printChecked(){
            return JSON.stringify(unitServices.checks);
        }
    }

})(angular, _);