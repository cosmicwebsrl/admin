angular
  .module('admin.login', [
    'theme.core.services'
  ])
  .controller('LoginController', ['$scope', '$theme', '$auth', '$location', 'toastr',
      function ($scope, $theme, $auth, $location, toastr) {
      'use strict';
      $theme.set('fullscreen', true);

      $scope.showLoginLoader = false;

      $scope.resetLogin = function () {
          $scope.email = '';
          $scope.password = '';
      }

      $scope.link = function (provider) {
        debugger;
          $auth.authenticate('facebook')
            .then(function (response) {
                debugger;
                // You have successfully linked an account.
                $scope.showLoginLoader = false;
                //$location.path("/");
                toastr.success('', 'Bine ai venit!');
            })
            .catch(function (response) {
                debugger;
                // Handle errors here.
                $scope.showLoginLoader = false;
                switch (response.status) {
                    case 401:
                        toastr.error('', 'Adresa de email sau parola nu este corecta.');
                        break

                    default:
                        toastr.error('', 'A aparut o eroane neasteptata. Va rugam sa ne contactati cu privire la aceasta problema.');
                        break;
                }
            });
      };

      $scope.doLogin = function () {

          var user = {
              email: $scope.email,
              password: $scope.password
          };

          $scope.showLoginLoader = true;

          $auth.login(user)
            .then(function (response) {
                $scope.showLoginLoader = false;
                $location.path("/");
                toastr.success('', 'Bine ai venit!');
                // Redirect user here after a successful log in.
            })
            .catch(function (response) {
                $scope.showLoginLoader = false;
                switch (response.status) {
                    case 401:
                        toastr.error('', 'Adresa de email sau parola nu este corecta.');
                        break

                    default:
                        toastr.error('', 'A aparut o eroane neasteptata. Va rugam sa ne contactati cu privire la aceasta problema.');
                        break;
                }
            });
      }



      $scope.$on('$destroy', function () {
          $theme.set('fullscreen', false);
      });
  }]);