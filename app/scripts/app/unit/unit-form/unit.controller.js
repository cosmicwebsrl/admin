(function (angular, _) {
    angular
        .module('admin.unit')
        .controller('UnitController', controller);

    controller.$inject = ['$scope', '$timeout', 'config', 'UnitService', 'unit', 'unitFacilities', 'BaseService'];

    function controller($scope, $timeout, config, UnitService, unit, unitFacilities, bs) {

        var vm = this;
        /**
         * VM Public
         */
        vm.form = {};
        vm.isEdit = bs.isEditMode();
        vm.onRegionSelect = onRegionSelect;
        vm.onCitySelect = onCitySelect;
        vm.debounce = null;
        vm.debounceTime = 300;

        /**
         * Google map settings
         */
        vm.geoCodingMapInstance = {};
        vm.mapMarker = null;
        vm.mapOptions = {
            lat: config.api.google.getMapCenter()[0],
            lng: config.api.google.getMapCenter()[1],
            zoom: 15,
            mapTypeControl: false,
            scrollwheel: false,
            streetViewControl: false
        };

        init();

        $scope.$on('GMaps:created', function (event, mapInstance) {
            vm.geoCodingMapInstance = mapInstance.map;
        });
        /**
         * @constructor
         */
        function init() {
            setDefaultFormData();
            setFormMode();

            getFormData();

            // DEMO
           // $timeout(setDemoData, 1000);
        }

        function setFormMode() {
            if (bs.isEditMode()) {
                vm.form.id = bs.getEditID();
                vm.form.mode = 'update';
            }
        }

        function setDefaultFormData() {
            
            unit.reset();

            vm.form = {
                id: -1,
                mode: 'create',
                data: {
                    types: [],
                    regions: [],
                    cities: []
                },
                input: unit,
            };
        }

        function setDemoData() {
            vm.form.input = {
                type: vm.form.data.types[0],
                name: "Demo Unit",
                region: vm.form.data.regions[0],

                gps: config.api.google.getMapCenter('string'),
                "street": "Street demo",
                "streetNo": "180A",
                "stars": 5,
                "capacity": 260,
                "rooms": 4,
                "receptionPhone": "0000 000000",
                "receptionFax": "123 456",
                "receptionName": "Reception Name Demo",
                "receptionEmail": "reception@demo.de",
                "website": "www.demo.ro",
                "shortDescriptionRO": "Romanian Short Description demo",
                "shortDescriptionEN": "English Short Description demo",
                "shortDescriptionFR": "French Short Description demo",
                "descriptionRO": "Romanian LONG Description demo",
                "descriptionEN": "English LONG Description demo",
                "descriptionFR": "French LONG Description demo",
                "contactPerson": "Contact Name Demo",
                "contactPersonFunction": "Dr. Ing. Wateva",
                "contactPersonPhone": "1111 111111",
                "contactPersonMail": "contact@demo.de",
                "companyName": "Demo SRL",
                "companRegCode": "JU/123123/32",
                "cui": "1231245"
            };

            onRegionSelect();

        }

        function getFormData() {
            UnitService.getDataSync()
                .then(function (response) {
                    // clear city cache
                    UnitService.clearCache('cities');
                    vm.form.data = UnitService.data;

                    // Edit data
                    getUnitData();
                });
        }

        function getUnitData() {
            if (bs.isEditMode()) {
                //EDIT MODE
            }
        }
        /**
         * @events
         */

        function onRegionSelect() {
            $timeout.cancel(vm.debounce);
            vm.debounce = $timeout(function () {

                UnitService.clearCache('cities');
                vm.form.input.city = null;

                if (!_.isEmpty(vm.form.input.region)) {
                    UnitService.getCities(vm.form.input.region.region);
                }

            }, vm.debounceTime)
        }

        function onCitySelect() {
            $timeout.cancel(vm.debounce);
            vm.debounce = $timeout(function () {

                var cty = vm.form.input.city;

                if (!_.isEmpty(cty)) {
                    vm.form.input.gps = cty.gps;
                } else {
                    vm.form.input.gps = config.api.google.getMapCenter('string');
                }

                var gpsObj = vm.form.input.gps.split(',');
                var gps = {
                    lat: parseFloat(gpsObj[0]) * 1,
                    lng: parseFloat(gpsObj[1]) * 1
                };

                UnitService.validateGPS(gps)
                    .then(function (gps) {
                        setMapMarker(gps);
                    }, function (defaultCenter) {
                        console.warn('GPS Coords not valid for city', cty.city);
                        setMapMarker(defaultCenter);
                    });


            }, vm.debounceTime)
        }

        function setMapMarker(gps) {
            vm.geoCodingMapInstance.setCenter(gps.lat, gps.lng);

            if (!_.isEmpty(vm.mapMarker)) {
                // Move pin 
                vm.mapMarker.setPosition(gps);
            } else {
                // Drop pin
                vm.mapMarker = vm.geoCodingMapInstance.addMarker(gps);

                // Draggable
                vm.mapMarker.setDraggable(true);
                vm.mapMarker.setAnimation(google.maps.Animation.DROP);
                google.maps.event.addListener(vm.mapMarker, 'dragend', onMapMarkerMove);
            }
        }

        function onMapMarkerMove() {
            var gps = vm.mapMarker.getPosition();
            vm.form.input.gps = [gps.lat(), gps.lng()].join(',');
        }
    }

})(angular, _);