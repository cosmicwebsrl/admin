(function () {
    angular
        .module('admin.unit')
        .factory('UnitService', service);

    service.$inject = ['$q', 'config', 'BaseService'];

    function service($q, config, bs) {

        var srv = {
            sync: null,
            data: {},
            getDataSync: getDataSync,
            getRegions: getRegions,
            getUnitTypes: getUnitTypes,
            getCities: getCities,
            validateGPS: validateGPS,

            // shared
            get: bs.get,
            clearCache: bs.clearCache,
            cacheEnabled: bs.cacheEnabled,
            handleError: bs.handleError
        };

        return srv;

        function getDataSync() {
            return getUnitTypes()
                .then(getRegions, srv.handleError)
        }

        function getUnitTypes() {
            srv.sync = $q.defer();

            // Use cache
            if (srv.cacheEnabled('types')) {
                srv.sync.resolve({ data: srv.data.types });
            } else {
                srv.get('unitTypes', 'list/' + config.app.getMode(config.app.lang))
                    .then(function (response) {
                        srv.data.types = response.data || [];
                        srv.sync.resolve(response.data)
                    }, srv.handleError);
            }

            return srv.sync.promise;
        }

        function getRegions() {
            srv.sync = $q.defer();

            // Use cache
            if (srv.cacheEnabled('regions')) {
                srv.sync.resolve({ data: srv.data.types });
            } else {
                srv.get('map', 'regions')
                    .then(function (response) {
                        srv.data.regions = response.data || [];
                        srv.sync.resolve(response.data)
                    }, srv.handleError);
            }

            return srv.sync.promise;
        }

        function getCities(region) {
            srv.sync = $q.defer();

            srv.get('map', 'cities/' + region)
                .then(function (response) {
                    srv.data.cities = response.data || [];
                    srv.sync.resolve(response.data)
                }, srv.handleError);

            return srv.sync.promise;
        }

        function validateGPS(gps) {
            srv.sync = $q.defer();

            if (_.isFinite(gps.lat) && _.isFinite(gps.lng)) {
                srv.sync.resolve(gps);
            } else {
                srv.sync.reject({
                    lat: config.api.google.getMapCenter()[0],
                    lng: config.api.google.getMapCenter()[1]
                });
            }

            return srv.sync.promise;
        }

    }
})(angular);