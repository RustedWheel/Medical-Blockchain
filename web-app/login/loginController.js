/* var app = angular.module('myApp');
app.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService) {
   
   $scope.formSubmit = function() {

     if(LoginService.login($scope.username, $scope.password)) {
       $rootScope.userName = $scope.username;
       $scope.error = '';
       $scope.username = '';
       $scope.password = '';
       $state.transitionTo('home');
     } else {
       $scope.error = "Incorrect username/password !";
     }

   };    
 }); */

 (function () {
  'use strict';

  angular
      .module('myApp')
      .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$location'];
  function LoginController($scope, $location) {

      // $scope.login = login;

      (function initController() {
          // reset login status
          // AuthenticationService.ClearCredentials();
      })();

      $scope.submitLogin = function () {
          $scope.login.dataLoading = true;
          console.log('Attempted to log in');
          /* AuthenticationService.Login($scope.username, $scope.password, function (response) {
              if (response.success) {
                  AuthenticationService.SetCredentials(vm.username, vm.password);
                  $location.path('/');
              } else {
                  FlashService.Error(response.message);
                  vm.dataLoading = false;
              }
          }); */ 
      };
  }

})();
