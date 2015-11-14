var app = angular.module('starter.services', []);



app.service('dataService', function() {

  this.showFriends = function($scope, $ionicLoading, success) {
    $ionicLoading.show({
      template: 'Loading...'
    });
    var query = new Parse.Query('UserRelation');
    query.include("SecondPerson");
    query.equalTo("FirstPerson", Parse.User.current());
    query.find({
      success: function(results) {
        $ionicLoading.hide();
        success.call(null, results);
      },
      error: function(error) {
        $ionicLoading.hide();
        $scope.showAlert("Error", error.message);
      }
    });
  };

});
