(function () {
    angular
        .module('admin.unit')
        .factory('UnitPlanService', service);

    service.$inject = ['$q', 'config', 'BaseService'];

    function service($q, config, bs) {

        var srv = {
            sync: null,
            data: {},

            getDataSync: getDataSync,
            getRooms: getRooms,

            // shared
            get: bs.get,
            clearCache: bs.clearCache,
            cacheEnabled: bs.cacheEnabled,
            handleError: bs.handleError
        };

        return srv;

        function getDataSync() {
            return getRoomTypes()
                .then(getRoomFacilities, srv.handleError);
        }

        function getRoomTypes() {

            srv.sync = $q.defer();

            // Use cache
            if (srv.cacheEnabled('types')) {
                srv.sync.resolve({ data: srv.data.types });
            } else {
                srv.get('unitRoomTypes', 'list/' + config.app.getMode())
                    .then(function (response) {
                        srv.data.types = response.data || [];
                        srv.sync.resolve(response.data)
                    }, srv.handleError);
            }

            return srv.sync.promise;
    }

    function getRoomFacilities() {
        srv.sync = $q.defer();

        // Use cache
        if (srv.cacheEnabled('facilities')) {
            srv.sync.resolve({ data: srv.data.facilities });
        } else {
            srv.get('unitRoomFacilities', 'list/' + config.app.getMode())
                .then(function (response) {
                    srv.data.facilities = response.data || [];
                    srv.sync.resolve(response.data)
                }, srv.handleError);
        }

        return srv.sync.promise;
    }


    function getRooms() {

        srv.sync = $q.defer();

        // Use cache
        if (srv.cacheEnabled('services')) {
            srv.sync.resolve({ data: srv.data.services });
        } else {
            srv.get('unitRooms', 'list/' + config.app.getMode())
                .then(function (response) {
                    srv.data.services = response.data || [];
                    srv.sync.resolve(response.data)
                }, srv.handleError);
        }

        return srv.sync.promise;
    }
}
})(angular);