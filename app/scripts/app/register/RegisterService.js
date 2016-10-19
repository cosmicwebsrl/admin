angular
  .module('admin.register', [])
  .service('RegisterService', ['$q', '$timeout', function ($q, $t) {
      'use strict';

      var auth = function () {
          return false;
      }

      return {
          auth: auth
      }



  }]);