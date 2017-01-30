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
            getUnitTypes: getUnitTypes,
            getCities: getCities,
            clearCache: clearCache
        };

        return srv;

        function get(service, option) {
            return $http.get(config.api.service(service, option));
        }


        function getDataSync() {
            return getUnitTypes().then(getRegions, handleError)
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

        function clearCache(cache){
            if(_.isUndefined(cache)){
                srv.data = {};
            } else {
                delete srv.data[cache];
            }
        }
    }
})(angular);