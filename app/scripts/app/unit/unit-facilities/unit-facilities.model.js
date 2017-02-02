(function () {
    angular
        .module('admin.unit')
        .factory('unitFacilities', model);

    model.$inject = ['config'];

    function model(config) {

        var m = {
            reset : setProperties
        };

        return m;

        function setProperties() {
            m.checks = [];
        }
    }
})(angular);