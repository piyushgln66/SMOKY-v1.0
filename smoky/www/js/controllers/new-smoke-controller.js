angular.module('starter.controllers')

.controller('NewSmoke', function($scope, $ionicLoading, $filter, $state, $ionicHistory, dataService) {

  $scope.data = {};

  dataService.showFriends($scope, $ionicLoading, function(results) {
    $scope.friends = results;
  });


  $scope.callbackMethod = function(query) {
    var results = $scope.friends;
    for (var i = 0; i < results.length; i++) {
      results[i].name = results[i].get("SecondPerson").get("firstname");
      results[i].name += " ";
      results[i].name += results[i].get("SecondPerson").get("lastname");

    }

    // return a filtered array
    var fileteredNames = $filter('filter')(results, {
      name: query
    });
    return fileteredNames;
  };

  $scope.check = function() {
    var src = $scope.data.selectedFriends;
  };

  $scope.addNewSmoke = function() {
    //now we have selected friends
    //cigarette amount
    //its time to divide it

    // show the loading screen
    $ionicLoading.show();

    var selectedFriends = $scope.data.selectedFriends;
    var numberOfCigarettes = $scope.data.cigarettes;

    var eachShare = +((numberOfCigarettes/(selectedFriends.length+1)).toFixed(2));

    var transactionsList = [];

    //now add to the database
    for(var i=0; i<selectedFriends.length; i++) {
      var borrower = selectedFriends[i];
      var lender = Parse.User.current();

      //create the class Object
      var transactionObj = new Parse.Object("Transactions");
      transactionObj.set("Lender", lender);
      transactionObj.set("Borrower", borrower);
      transactionObj.set("Suttas", eachShare);

      transactionsList[i] = transactionObj;
    }

    //now add the transaction list into the database
    Parse.Object.saveAll(transactionsList, {
    success: function(list) {
      // clear the cache of other tabs so that when we switch back to home, we see the fresh list
      $ionicHistory.clearCache();
      $state.go("tab.dash");
      // clear the cache of other tabs so that when we switch back to home, we see the fresh list
      $ionicHistory.clearCache();
      // hide the loading screen
      $ionicLoading.hide();
    },
    error: function(error) {
      // hide the loading screen
      $ionicLoading.hide();
    },
  });

  };

});
