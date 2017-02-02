(function () {
    angular
        .module('admin.unit')
        .factory('unitPlan', model);

    model.$inject = ['config'];

    function model(config) {

        var m = {
            reset: setProperties
        };

        return m;

        function setProperties() {
            m.batch = [];
            m.checks = [];
        }
    }
})(angular);