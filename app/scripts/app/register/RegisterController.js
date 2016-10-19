angular
  .module('admin.register', [
    'theme.core.services'
  ])
  .controller('RegisterController', ['$scope', '$theme', '$auth', '$location', 'toastr',
      function ($scope, $theme, $auth, $location, toastr) {
          'use strict';

          $scope.master = {};

          $scope.reset = function (form) {
              if (form) {
                  form.$setPristine();
                  form.$setUntouched();
              }
              $scope.user = angular.copy($scope.master);
          }

          $scope.reset();
          $scope.showRegisterLoader = false;

          $scope.registerMe = function (user) {

              $scope.showRegisterLoader = true;
              $scope.master = angular.copy(user);

              $auth.signup($scope.master)
                  .then(function (response) {
                      // Rediret user here to login page or perhaps some other intermediate page
                      // that requires email address verification before any other part of the site
                      // can be accessed.
                      $scope.showRegisterLoader = false;
                      $location.path('/login');
                      toastr.success('', 'Un email pentru activarea contului a fost trimis pe adresa de email folosita la inregistrare!');
                  })
                  .catch(function (response) {
                      // Handle errors here.
                      $scope.showRegisterLoader = false;
                      switch (response.status) {
                          case 400:
                              _.map(response.data.message, function (value, key) {
                                  value.forEach(function (error) {
                                      toastr.error('', error);
                                  })
                                  
                              });                              
                              break

                          default:
                              toastr.error('', 'A aparut o eroane neasteptata. Va rugam sa ne contactati cu privire la aceasta problema.');
                              break;
                      }
                  });

          }

          $theme.set('fullscreen', true);

          $scope.$on('$destroy', function () {
              $theme.set('fullscreen', false);
          });
      }]);