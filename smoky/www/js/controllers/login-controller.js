angular.module('starter.controllers')

.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading, $rootScope, Auth) {

  $scope.data = {};

  $scope.showAlert = function(title, message) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: message
    });
  };

  $scope.signupEmail = function() {

    // show a loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    var firstname = $scope.data.firstname;
    var lastname = $scope.data.lastname;
    var email = $scope.data.email;
    var password = $scope.data.password;
    var confirmPassword = $scope.data.confirmPassword;

    if (!firstname) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the firstname");
      return;
    }
    if (!lastname) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the lastname");
      return;
    }
    if (!email) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the email");
      return;
    }
    if (!password) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the password");
      return;
    }
    if (password !== confirmPassword) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Passwords do not match");
      return;
    }

    //Create a new user on Parse
    var user = new Parse.User();
    user.set("firstname", firstname);
    user.set("lastname", lastname);
    user.set("email", email);
    //username same as email
    user.set("username", email);
    user.set("password", password);

    //do the verifications



    user.signUp(null, {
      success: function(user) {
        // hide the loading screen
        $ionicLoading.hide();

        //set the user in the Auth Factory
        Auth.setUser({
          username: user
        });
        $state.go("tab.dash");
      },
      error: function(user, error) {
        // hide the loading screen
        $ionicLoading.hide();
        // Show the error message somewhere and let the user try again.
        $scope.showAlert("Error", error.message);
      }

    });

  };

  $scope.loginEmail = function() {

    // show a loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    var username = $scope.data.username;

    Parse.User.logIn($scope.data.username, $scope.data.password, {

      success: function(user) {
        // hide the loading screen
        $ionicLoading.hide();

        //set the user in the Auth Factory
        Auth.setUser({
          username: user
        });
        $state.go("tab.dash");
      },
      error: function(user, error) {
        // hide the loading screen
        $ionicLoading.hide();
        // The login failed. Check error to see why.
        $scope.showAlert("Error", error.message);
      }
    });
  };

});
