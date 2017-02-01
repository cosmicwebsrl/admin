(function (angular, _) {
    'use strict';

    angular
        .module('admin')
        .constant('config', {
            app: {
                cache: true,
                lang: 'ro',
                data: 'simple', // or full
                getMode: getMode
            },
            api: {
                service: getService,
                google: {
                    geocode: 'https://maps.googleapis.com/maps/api/geocode/json',
                    mapDefaultCenter: [44.434735, 26.102706], // bucharest
                    getMapCenter: getMapCenter
                },
                link: {
                    base: 'http://api.informareturist.ro',
                    unit: 'unit',
                    unitTypes: 'unit-type',
                    unitFacilities: 'unit-facility',
                    unitServices: 'unit-service',
                    map: 'map'
                }
            }
        });

    function getService(service, options) {
        var base = [this.link.base, this.link[service]].join('/');
        if (_.isUndefined(options)) {
            return base;
        } else {
            return [base, options].join('/');
        }
    }

    function getMode(options) {
        var base = this.data;
        if (_.isUndefined(options)) {
            return base;
        } else {
            return [base, options].join('/');
        }
    }

    function getMapCenter(mode) {

        var center = this.mapDefaultCenter;

        switch (mode) {
            case 'string':
                return center.join(',');
                break;
            default:
                return center;
                break;
        }
    }

})(angular, _);