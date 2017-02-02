(function (angular, _) {
    angular
        .module('admin.unit')
        .controller('UnitFacilitiesController', controller);

    controller.$inject = ['UnitFacilitiesService', 'unitFacilities', 'BaseService'];

    function controller(unitFacilitiesService, unitFacilities, bs) {

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
            unitFacilities.reset();

            vm.form = {
                id: -1,
                data: {},
                input: unitFacilities
            }
        }

        function getFormData() {
            unitFacilitiesService.getDataSync()
                .then(function (response) {
                    vm.form.data = unitFacilitiesService.data;
                });
        }

        function isChecked(id, asIndex) {
            var index = unitFacilities.checks.indexOf(id);
            return asIndex ? index : index !== -1;
        }

        function toggleCheck(id) {
            var index = isChecked(id, true);
            if (isChecked(id)) {
                // uncheck
                unitFacilities.checks.splice(index, 1);
            } else {
                unitFacilities.checks.push(id);
            }
        }

        // dev
        function printChecked(){
            return JSON.stringify(unitFacilities.checks);
        }
    }

})(angular, _);