(function () {
    angular
        .module('admin.unit')
        .factory('UnitFormService', service);

    service.$inject = ['$http', '$q', 'config'];

    function service($http, $q, config) {

        var _defer = null;
        var srv = {
            data: {},
            get: get,
            getDataSync: getDataSync,
            getRegions: getRegions,
            getFacilities: getFacilities,
            getUnitTypes: getUnitTypes,
            getCities: getCities,
            clearCache: clearCache,
            validateGPS: validateGPS
        };

        return srv;

        function get(service, option) {
            return $http.get(config.api.service(service, option));
        }


        function getDataSync() {
            return getUnitTypes()
                .then(getRegions, handleError)
                .then(getFacilities, handleError)
                .then(getServices, handleError)
        }

        function getUnitTypes() {
            _defer = $q.defer();

            // Use cache
            if (cacheEnabled('types')) {
                _defer.resolve({ data: srv.data.types });
            } else {
                get('unitTypes', config.app.getMode(config.app.lang))
                    .then(function (response) {
                        srv.data.types = response.data || [];
                        _defer.resolve(response.data)
                    }, handleError);
            }
            // Query data
            return _defer.promise;
        }

        function getRegions() {

            _defer = $q.defer();

            // Use cache
            if (cacheEnabled('regions')) {
                return _defer.resolve({ data: srv.data.types });
            } else {
                get('regions')
                    .then(function (response) {
                        srv.data.regions = response.data || [];
                        _defer.resolve(response.data)
                    }, handleError);
            }

            return _defer.promise;
        }

        function getFacilities() {

            _defer = $q.defer();

            // Use cache
            if (cacheEnabled('facilities')) {
                return _defer.resolve({ data: srv.data.facilities });
            } else {
                get('facilities', config.app.getMode())
                    .then(function (response) {
                        srv.data.facilities = response.data || [];
                        _defer.resolve(response.data)
                    }, handleError);
            }

            return _defer.promise;
        }

        function getServices(){
            
            _defer = $q.defer();

            // Use cache
            if (cacheEnabled('services')) {
                return _defer.resolve({ data: srv.data.services });
            } else {
                get('services', config.app.getMode())
                    .then(function (response) {
                        srv.data.services = response.data || [];
                        _defer.resolve(response.data)
                    }, handleError);
            }

            return _defer.promise;
        }

        function getCities(region) {
            _defer = $q.defer();

            get('cities', region)
                .then(function (response) {
                    srv.data.cities = response.data || [];
                    _defer.resolve(response.data)
                }, handleError);

            return _defer.promise;
        }

        function handleError(response) {
            return _defer.reject({ status: 501, data: { message: 'Unexpected Error' } });
        }

        function cacheEnabled(cache) {
            return config.app.cache && !_.isUndefined(srv.data[cache]);
        }

        function clearCache(cache) {
            if (_.isUndefined(cache)) {
                srv.data = {};
            } else {
                delete srv.data[cache];
            }
        }

        function validateGPS(gps) {
            _defer = $q.defer();

            if (_.isFinite(gps.lat) && _.isFinite(gps.lng)) {
                _defer.resolve(gps);
            } else {
                _defer.reject({
                    lat: config.api.google.getMapCenter()[0],
                    lng: config.api.google.getMapCenter()[1]
                });
            }

            return _defer.promise;
        }
    }
})(angular);