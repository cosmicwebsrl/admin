angular
  .module('admin.login', [])
  .service('LoginService', ['$q', '$timeout', function($q, $t) {
      'use strict';

      var auth = function () {
          return false;
      }

      return {
          auth: auth
      }

 

  }]);