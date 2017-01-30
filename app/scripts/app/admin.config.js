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
                    geocode: 'https://maps.googleapis.com/maps/api/geocode/json'
                },
                link: {
                    base: 'http://api.informareturist.ro',
                    unitListSimple: 'unit/list/simple',
                    unitListFull: 'unit/list/full',
                    unitCount: 'unit/count',
                    unitTypes: 'unit/types',
                    regions: 'map/regions',
                    cities: 'map/cities'
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
})(angular, _);