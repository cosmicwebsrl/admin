(function () {
    angular
        .module('admin.unit')
        .factory('BaseService', service);

    service.$inject = ['$http', '$q', '$routeParams', 'config'];

    function service($http, $q, $routeParams, config) {
        var srv = {
            data: {},
            get: get,
            handleError: handleError,
            cacheEnabled: cacheEnabled,
            clearCache: clearCache,
            isEditMode :isEditMode,
            getEditID: getEditID
        };

        return srv;

        
        function get(service, option) {
            return $http.get(config.api.service(service, option));
        }

        function set(service, options){
            return $http.post(config.api.service(service, option));
        }
        
        function handleError(response) {
            // TODO something like
            //return reject({ status: 501, data: { message: 'Unexpected Error' } });
            if(srv.sync){
                srv.sync.reject({ status: 501, data: { message: 'Unexpected Error' } });
            }
        }

        function cacheEnabled(cache) {
            return config.app.cache && !_.isUndefined(this.data[cache]);
        }

        function clearCache(cache) {
            if (_.isUndefined(cache)) {
                this.data = {};
            } else {
                delete this.data[cache];
            }
        }

        function isEditMode() {
            return _.isNumber($routeParams.id)
        }

        function getEditID() {
            return $routeParams.id || false;
        }
    }
})(angular);