angular.module('starter.controllers')

.controller('DashCtrl',function($scope, $ionicLoading, dataService, $rootScope) {

  dataService.showFriends($scope, $ionicLoading, function(results) {
    $scope.friends = results;

    $ionicLoading.show();


    var query1 = new Parse.Query('Transactions');
    query1.equalTo("Lender", Parse.User.current());

    var query2 = new Parse.Query('Transactions');
    query2.equalTo("Borrower", Parse.User.current());

    var mainQuery = Parse.Query.or(query1, query2);

    mainQuery.find({
      success: function(results) {
        $ionicLoading.hide();
        //now for each friend calculate the Suttas
        for(var i=0;i<$scope.friends.length; i++) {

          var netSuttaOwedByThisFriend =0;

          for(var j=0; j<results.length; j++) {
            if(results[j].get("Lender").id === $scope.friends[i].get("SecondPerson").id) {
              netSuttaOwedByThisFriend -= results[j].get("Suttas");
            }
            else if(results[j].get("Borrower").id === $scope.friends[i].get("SecondPerson").id) {
              netSuttaOwedByThisFriend += results[j].get("Suttas");
            }
          }

          $scope.friends[i].suttasOwed = netSuttaOwedByThisFriend;

        }
      },
      error: function(error) {
        $ionicLoading.hide();
        $scope.showAlert("Error", error.message);
      }
    });
  });

});
