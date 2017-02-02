(function (angular, _) {
    angular
        .module('admin.unit')
        .controller('UnitPlanController', controller);

    controller.$inject = ['$modal', 'UnitPlanService', 'UnitRoomService', 'unitPlan', 'BaseService'];

    function controller($modal, unitPlanService, unitRoomService, unitPlan, bs) {

        var vm = this;
        vm.addPlan = addPlan;
        vm.getPlans = getPlans;
        vm.delPlan = delPlan;
        vm.openPlanRooms = openPlanRooms;
        init();

        /**
         * @constructor
         */
        function init() {
            setDefaultFormData();
            setFormMode();

            if (bs.isEditMode()) {
                getPlans();
            }
        }

        function setFormMode() {
            if (bs.isEditMode()) {
                vm.form.id = bs.getEditID();
                vm.form.mode = 'update';
            }
        }

        function setDefaultFormData() {
            unitPlan.reset();

            vm.form = {
                id: -1,
                show: true,
                error: false,
                data: {},
                input: {
                    start: null,
                    end: null,
                    currency: null
                }
            }
        }

        function getPlans() {
            return unitPlan.batch;
        }

        function delPlan($index) {
            if (bs.isEditMode()) {
                // TODO request database delete
            } else {
                unitPlan.batch.splice($index, 1);
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

        function addPlan() {
            var input = vm.form.input;

            if (!input.start || !input.end || !input.currency) {
                vm.form.error = true;
            } else {
                vm.form.error = false;
                vm.form.show = false;

                unitPlan.batch.push(input);

                // clean form
                vm.form.input = {}
            }
        }


        function openPlanRooms(plan) {
            $modal.open({
                templateUrl: './scripts/app/unit/unit-plan/unit-plan-rooms-modal.html',
                controllerAs: 'planRoomCtrl',
                controller: ['$scope', '$modalInstance', 'unitRoom', 'unitPlan', function ($scope, $modalInstance, unitRoom, unitPlan) {
                    var vm = this;
                    vm.planIndex = plan;
                    vm.getFacilityName = getFacilityName;
                    vm.getTypeName = getTypeName;
                    vm.title = title;
                    vm.getAvailableRooms = getAvailableRooms;
                    vm.ok = ok;

                    updateModalData();

                    function title(key) {
                        return unitPlan.batch[vm.planIndex][key];
                    }


                    function getAvailableRooms() {
                        return unitRoom.batch;
                    }

                    function ok() {

                        var plan = unitPlan.batch[vm.planIndex];
                        plan.rooms = [];
                        // TODO Change index with id
                        _.each(vm._rooms, function (room, index) {
                            if(room)
                            plan.rooms.push({
                                index: index,
                                price: vm._price[index]
                            })
                        });

                        $modalInstance.close();
                    };

                    function updateModalData() {
                        var plan = unitPlan.batch[vm.planIndex];
                        vm._rooms = new Array(unitRoom.batch.length);
                        vm._price = new Array(unitRoom.batch.length);
                        _.each(plan.rooms, function (room, index) {
                            vm._rooms[room.index] = true;
                            vm._price[room.index] = room.price;
                        });
                    }

                }],
                size: 320
            });

        }
    }

})(angular, _);