angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading, dataService) {

  dataService.showFriends($scope, $ionicLoading, function(results) {
    $scope.friends = results;
  });

})


.controller('FriendsCtrl', function($scope, $ionicLoading, $ionicPopup, $ionicHistory) {

  $scope.data = {};
  $scope.foundFriend = false;
  // $scope.friendAdded = false;

  $scope.showAlert = function(title, message) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: message
   });
 };

  $scope.searchFriend = function() {

    // show a loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    var emailToSearch = $scope.data.emailToSearch;
    var query = new Parse.Query("_User");
    query.equalTo("email", emailToSearch);
    query.find({
      success: function(results) {

        if(results.length === 0) {
          $scope.foundFriend= false;
          // hide the loading screen
          $ionicLoading.hide();
          $scope.showAlert("Error", "No friend found with this email");
          return;
        }
        $scope.friend = results[0];
        $scope.foundFriend = true;
        //now check if the friend is already added or not
        var query = new Parse.Query("UserRelation");
        query.equalTo("FirstPerson", Parse.User.current());
        query.equalTo("SecondPerson", $scope.friend);
        query.find({
          success: function(userResults) {
            if(userResults.length>0) {
              // hide the loading screen
              $ionicLoading.hide();
              $scope.friendAdded = true;
            } else {
              // hide the loading screen
              $ionicLoading.hide();
              $scope.friendAdded = false;
            }
          },
          error: function(error) {
            // hide the loading screen
            $ionicLoading.hide();
            $scope.showAlert("Error", error.message);
          }
        });
    },
    error: function(error) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", error.message);
    }
  });
};


  $scope.addFriend = function() {
    $ionicLoading.show({
      template: 'Loading...'
    });
    var currentUser = Parse.User.current();
    var friendUser = $scope.friend;

    var UserRelation = Parse.Object.extend("UserRelation");
    var userRelation = new UserRelation();
    userRelation.set("FirstPerson", currentUser);
    userRelation.set("SecondPerson", friendUser);
    userRelation.set("Sutta", 0);

    userRelation.save({
      success : function() {
        console.log("first user saved");


        var userRelation = new UserRelation();
        userRelation.set("FirstPerson", friendUser);
        userRelation.set("SecondPerson", currentUser);
        userRelation.set("Sutta", 0);
        userRelation.save({
          success : function() {
            $ionicLoading.hide();
            $scope.friendAdded = true;
            console.log("second user saved");

            // clear the cache of other tabs so that when we switch back to home, we see the fresh list
            $ionicHistory.clearCache();
          },
          error : function(error) {
            $ionicLoading.hide();
            $scope.showAlert("Error", error.message);
          }
        });
      },
      error : function(error) {
          $ionicLoading.hide();
          $scope.showAlert("Error", error.message);
      }
    });


  };

})


.controller('LoginCtrl', function($scope, $state, $ionicPopup, $ionicLoading) {

  $scope.data = {};

  $scope.showAlert = function(title, message) {
   var alertPopup = $ionicPopup.alert({
     title: title,
     template: message
   });
 };

  $scope.signupEmail = function(){

    // show a loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    var firstname = $scope.data.firstname;
    var lastname = $scope.data.lastname;
    var email = $scope.data.email;
    var password = $scope.data.password;
    var confirmPassword = $scope.data.confirmPassword;

    if(!firstname) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the firstname");
      return;
    }
    if(!lastname) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the lastname");
      return;
    }
    if(!email) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the email");
      return;
    }
    if(!password) {
      // hide the loading screen
      $ionicLoading.hide();
      $scope.showAlert("Error", "Enter the password");
      return;
    }
    if(password !== confirmPassword) {
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

  $scope.loginEmail = function(){

    // show a loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    var username = $scope.data.username;

    Parse.User.logIn($scope.data.username, $scope.data.password, {

      success: function(user) {
        // hide the loading screen
        $ionicLoading.hide();
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

})

.controller('NewSmoke', function($scope) {

})



.controller('AccountCtrl', function($scope, $state) {

  $scope.logout = function() {
    if ( Parse.User.current() ) {
            Parse.User.logOut();
            $state.go("login");
          }
  };

});
