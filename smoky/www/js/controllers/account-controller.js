angular.module('starter.controllers')

.controller('AccountCtrl', function($scope, $state, $rootScope, $ionicLoading, $ionicPopup, Auth) {

  $scope.data = {};

  $scope.data.user = Parse.User.current();

  $scope.data.isEditable = false;
  $scope.data.editPassword = false;

  $scope.showAlert = function(title, message) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: message
    });
  };

  $scope.editDetails = function() {
    $scope.data.isEditable = true;
    $scope.data.firstname = $scope.data.user.get("firstname");
    $scope.data.lastname = $scope.data.user.get("lastname");
  };

  $scope.changePassword = function() {
    $scope.data.editPassword = true;
  };

  $scope.cancel = function() {
    $scope.data.editPassword = false;
    $scope.data.isEditable = false;
  };


  $scope.save = function() {

    var user = null;

    if (!$scope.data.editPassword) {

      if (!$scope.data.firstname) {
        $scope.showAlert("Error", "Please enter the firstname");
        return;
      }
      if (!$scope.data.lastname) {
        $scope.showAlert("Error", "Please enter the lastname");
        return;
      }

      $ionicLoading.show();

      user = Parse.User.current();
      user.set("firstname", $scope.data.firstname);
      user.set("lastname", $scope.data.lastname);
      user.save({
        success: function() {
          $ionicLoading.hide();
          $scope.data.isEditable = false;
        },
        error: function(error) {
          $ionicLoading.hide();
          $scope.showAlert("Error", error.message);
        }
      });
    } else {

      var newPassword = $scope.data.newPassword;
      var confirmPassword = $scope.data.confirmPassword;

      if (!newPassword) {
        $scope.showAlert("Error", "Please enter the new password");
        return;
      }


      if (newPassword !== confirmPassword) {
        $scope.showAlert("Error", "Passwords do not match");
        return;
      }

      $ionicLoading.show();
      user = Parse.User.current();
      user.set("password", newPassword);
      user.save()
        .then(
          function(user) {
            $ionicLoading.hide();
            $scope.data.editPassword = false;
            $scope.showAlert("Success", "Password changed successfully!");
          },
          function(error) {
            $ionicLoading.hide();
            $scope.showAlert("Error", error.message);
          }
        );
    }

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
