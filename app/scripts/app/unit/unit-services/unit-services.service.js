(function () {
    angular
        .module('admin.unit')
        .factory('UnitServicesService', service);

    service.$inject = ['$q', 'config', 'BaseService'];

    function service($q, config, bs) {

        var srv = {
            sync: null,
            data: {},
            
            getDataSync: getDataSync,
            getServices: getServices,

            // shared
            get: bs.get,
            clearCache: bs.clearCache,
            cacheEnabled: bs.cacheEnabled,
            handleError: bs.handleError
        };

        return srv;

        function getDataSync() {
            return getServices()
        }

        function getServices() {

            srv.sync = $q.defer();

            // Use cache
            if (srv.cacheEnabled('services')) {
                srv.sync.resolve({ data: srv.data.services });
            } else {
                srv.get('unitServices', 'list/' + config.app.getMode())
                    .then(function (response) {
                        srv.data.services = response.data || [];
                        srv.sync.resolve(response.data)
                    }, srv.handleError);
            }

            return srv.sync.promise;
        }
    }
})(angular);