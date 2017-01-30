angular
  .module('themesApp', [
    'admin',
    'theme',
    'theme.demos',
    'satellizer',
    'toastr',
    'ngMessages'
  ])
  .config(['$provide', '$routeProvider', '$authProvider', 'toastrConfig',
      function ($provide, $routeProvider, $authProvider, toastrConfig) {
          'use strict';
          // Optional: For client-side use (Implicit Grant), set responseType to 'token' (default: 'code')
      
          $authProvider.google({
              clientId: 'Google Client ID'
          });

          $authProvider.httpInterceptor = function () { return true; },
          $authProvider.withCredentials = false;
          $authProvider.tokenRoot = null;
          $authProvider.baseUrl = 'http://api.informareturist.ro/', // 'http://192.168.1.14/api/public/';
          $authProvider.loginUrl = '/auth/login';
          $authProvider.signupUrl = '/auth/signup';
          $authProvider.unlinkUrl = '/auth/unlink/';
          $authProvider.tokenName = 'token';
          $authProvider.tokenPrefix = 'satellizer';
          $authProvider.tokenHeader = 'Authorization';
          $authProvider.tokenType = 'Bearer';
          $authProvider.storageType = 'localStorage';

          // Facebook
          $authProvider.facebook({
              clientId: '1758947384352787',
              //responseType: 'token',
              name: 'facebook',
              url: '/auth/facebook',
              authorizationEndpoint: 'https://www.facebook.com/v2.7/dialog/oauth',
              redirectUri: window.location.origin + '/',
              requiredUrlParams: ['display', 'scope'],
              scope: ['email'],
              scopeDelimiter: ',',
              display: 'popup',
              oauthType: '2.0',
              popupOptions: { width: 580, height: 400 }
          });

          // Google
          $authProvider.google({
              url: '/auth/google',
              clientId: '683840010594-hsmliqpctasrfn75knnjjvvfmv8ci9fh.apps.googleusercontent.com',
              authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
              redirectUri: window.location.origin,
              requiredUrlParams: ['scope'],
              optionalUrlParams: ['display'],
              scope: ['profile', 'email'],
              scopePrefix: 'openid',
              scopeDelimiter: ' ',
              display: 'popup',
              oauthType: '2.0',
              popupOptions: { width: 452, height: 633 }
          });


          var checkLogin = ['$auth', '$location', function ($auth, $location) {
              if (!$auth.isAuthenticated()) {
                  $location.path("/login");
              }
          }];

          $routeProvider
            .when('/', {
                templateUrl: 'views/index.html',
                resolve: {
                    checkLogin,
                    loadCalendar: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                          'bower_components/fullcalendar/fullcalendar.js',
                        ]);
                    }]
                }
            })
            //for testing
            // .when('/:templateFile', {
            //    templateUrl: function (param) {
            //        return 'views/' + param.templateFile + '.html';
            //    }
            // })
            .when('#', {
                templateUrl: 'views/index.html',
                resolve: {
                    checkLogin
                }
            })
            .when('/login', {
                templateUrl: 'scripts/app/login/extras-login.html',
                controller: 'LoginController',
                resolve: {
                    checkLogin
                }
            })
              .when('/register', {
                  templateUrl: 'scripts/app/register/extras-signupform.html',
                  controller: 'RegisterController'
              })
              .when('/units',{
                  templateUrl: 'scripts/app/unit/list/unit-list.html',
                  controller: 'UnitListController',
                  controllerAs: 'unitCtrl'
              })
            .otherwise({
                redirectTo: '/'
            });


          angular.extend(toastrConfig, {
              allowHtml: false,
              closeButton: true,
              closeHtml: '<button>&times;</button>',
              extendedTimeOut: 1000,
              iconClasses: {
                  error: 'toast-error',
                  info: 'toast-info',
                  success: 'toast-success',
                  warning: 'toast-warning'
              },
              messageClass: 'toast-message',
              onHidden: null,
              onShown: null,
              onTap: true,
              progressBar: true,
              tapToDismiss: true,
              timeOut: 4000,
              titleClass: 'toast-title',
              toastClass: 'toast',
              maxOpened: 0,
              newestOnTop: true,
              positionClass: 'toast-bottom-left',
              preventDuplicates: false,
              preventOpenDuplicates: false,
              target: 'body'
          });



      }]);