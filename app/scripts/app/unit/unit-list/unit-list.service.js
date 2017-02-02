(function () {
    angular
        .module('admin.unit')
        .factory('UnitListService', service);

    service.$inject = ['$http', 'config'];

    function service($http, config) {

        var srv = {
            get: get
        };

        return srv;

        function get(service, option) {
            return $http.get(config.api.service(service, option));
        }
    }
})(angular);