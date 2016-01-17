angular.module('starter.controllers')

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

    var emailToSearch = $scope.data.emailToSearch;
    if (Parse.User.current().get("email") === emailToSearch) {
      $scope.showAlert("Error", "Do not enter your own email");
      return;
    }
    // show a loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    var query = new Parse.Query("_User");
    query.equalTo("email", emailToSearch);
    query.find({
      success: function(results) {

        if (results.length === 0) {
          $scope.foundFriend = false;
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
            if (userResults.length > 0) {
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
      success: function() {
        console.log("first user saved");


        var userRelation = new UserRelation();
        userRelation.set("FirstPerson", friendUser);
        userRelation.set("SecondPerson", currentUser);
        userRelation.set("Sutta", 0);
        userRelation.save({
          success: function() {
            $ionicLoading.hide();
            $scope.friendAdded = true;
            console.log("second user saved");

            // clear the cache of other tabs so that when we switch back to home, we see the fresh list
            $ionicHistory.clearCache();
          },
          error: function(error) {
            $ionicLoading.hide();
            $scope.showAlert("Error", error.message);
          }
        });
      },
      error: function(error) {
        $ionicLoading.hide();
        $scope.showAlert("Error", error.message);
      }
    });


  };

});
