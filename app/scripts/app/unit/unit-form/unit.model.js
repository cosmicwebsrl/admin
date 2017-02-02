(function () {
    angular
        .module('admin.unit')
        .factory('unit', model);

    model.$inject = ['config'];

    function model(config) {

        var m = {
            reset : setProperties
        };

        return m;

        function setProperties() {
            m.type = null;
            m.name = null;
            m.region = null;
            m.citiy = null;
            m.gps = config.api.google.getMapCenter('string');
            m.street = null;
            m.streetNo = null;
            m.stars = null;
            m.capacity = null;
            m.rooms = null;
            m.receptionPhone = null;
            m.receptionFax = null;
            m.receptionName = null;
            m.receptionEmail = null;
            m.website = null;
            m.shortDescriptionRO = null;
            m.shortDescriptionEN = null;
            m.shortDescriptionFR = null;
            m.descriptionRO = null;
            m.descriptionEN = null;
            m.descriptionFR = null;
            m.contactPerson = null;
            m.contactPersonFunction = null;
            m.contactPersonPhone = null;
            m.contactPersonMail = null;
            m.companyName = null;
            m.companRegCode = null;
            m.cui = null;
        }
    }
})(angular);