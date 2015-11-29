angular.module('starter.controllers')

.controller('AccountCtrl', function($scope, $state, $rootScope, Auth) {

  $scope.data ={};

  $scope.data.user = Parse.User.current();

  $scope.data.isEditable = false;

  $scope.editDetails = function() {
    $scope.data.isEditable = true;
    $scope.data.firstname = $scope.data.user.get("firstname");
    $scope.data.lastname = $scope.data.user.get("lastname");
  };

  $scope.cancel = function() {
    $scope.data.isEditable = false;
  };

  $scope.save = function() {
    var user = Parse.User.current();
    user.set("firstname", $scope.data.firstname);
    user.set("lastname", $scope.data.lastname);
    user.save();
    $scope.data.user = user;
    $scope.data.isEditable = false;
  };

  $scope.logout = function() {
    if (Parse.User.current()) {
      Parse.User.logOut();

      //logout using Auth Factory
      Auth.logout();

      $state.go("login");
    }
  };

});
