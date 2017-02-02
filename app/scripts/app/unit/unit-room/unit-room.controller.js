(function (angular, _) {
    angular
        .module('admin.unit')
        .controller('UnitRoomController', controller);

    controller.$inject = ['UnitRoomService', 'unitRoom', 'BaseService'];

    function controller(unitRoomService, unitRoom, bs) {

        var vm = this;
        /**
         * VM Public
         */
        vm.form = {};
        vm.isChecked = isChecked;
        vm.toggleCheck = toggleCheck;
        vm.printChecked = printChecked;
        vm.addRoom = addRoom;
        vm.getRooms = getRooms;
        vm.delRoom = delRoom;
        vm.getFacilityName = getFacilityName;
        vm.getTypeName = getTypeName;
        init();

        /**
         * @constructor
         */
        function init() {
            setDefaultFormData();
            setFormMode();

            getFormData();

            if (bs.isEditMode()) {
                getRooms();
            }
        }

        function setFormMode() {
            if (bs.isEditMode()) {
                vm.form.id = bs.getEditID();
                vm.form.mode = 'update';
            }
        }

        function setDefaultFormData() {
            unitRoom.reset();

            vm.form = {
                id: -1,
                show: true,
                error: false,
                data: {},
                input: {
                    no: null,
                    type: null
                },
                _facilities: []
            }
        }

        function getFormData() {
            unitRoomService.getDataSync()
                .then(function (response) {
                    vm.form.data = unitRoomService.data;
                });
        }


        function getRooms() {
            return unitRoom.batch;
        }

        function delRoom($index){
            if(bs.isEditMode()){
                // TODO request database delete
            } else {
                unitRoom.batch.splice($index,1);
            }
        }

        function getFacilityName(id) {
            var facilityObj = _.find(unitRoomService.data.facilities, function (f) {
                return f.room_facility_id == id;
            });

            return facilityObj.room_facility_name_ro || "";
        }

        function getTypeName(id) {
            var typeObj = _.find(unitRoomService.data.types, function (t) {
                return t.room_type_id == id;
            });

            return typeObj.room_type_ro || "";
        }

        function addRoom() {
            var input = vm.form.input;

            if (!input.type || !input.no) {
                vm.form.error = true;
            } else {
                vm.form.error = false;
                vm.form.show = false;
                input.facilities = unitRoom.checks;

                unitRoom.batch.push(input);

                // clean form
                vm.form.input = {}
                vm.form._facility = [];
                unitRoom.checks = [];
            }
        }

        function isChecked(id, asIndex) {
            var index = unitRoom.checks.indexOf(id);
            return asIndex ? index : index !== -1;
        }

        function toggleForm() {
            vm.form.show = true;
        }

        function toggleCheck(id) {
            var index = isChecked(id, true);
            if (isChecked(id)) {
                // uncheck
                unitRoom.checks.splice(index, 1);
            } else {
                unitRoom.checks.push(id);
            }
        }

        // dev
        function printChecked() {
            return JSON.stringify(unitRoom.checks);
        }

        // dev
        function printList() {
        }
    }

})(angular, _);