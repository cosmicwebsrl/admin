(function () {
    angular
        .module('admin.unit')
        .factory('UnitFacilitiesService', service);

    service.$inject = ['$q', 'config', 'BaseService'];

    function service($q, config, bs) {

        var srv = {
            sync: null,
            data: {},
            
            getDataSync: getDataSync,
            getFacilities: getFacilities,

            // shared
            get: bs.get,
            clearCache: bs.clearCache,
            cacheEnabled: bs.cacheEnabled,
            handleError: bs.handleError
        };

        return srv;

        function getDataSync() {
            return getFacilities()
        }

        function getFacilities() {

            srv.sync = $q.defer();

            // Use cache
            if (srv.cacheEnabled('facilities')) {
                srv.sync.resolve({ data: srv.data.facilities });
            } else {
                srv.get('unitFacilities', 'list/' + config.app.getMode())
                    .then(function (response) {
                        srv.data.facilities = response.data || [];
                        srv.sync.resolve(response.data)
                    }, srv.handleError);
            }

            return srv.sync.promise;
        }
    }
})(angular);