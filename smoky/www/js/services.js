var app = angular.module('starter.services', ['ngCookies']);



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


app.factory('Auth', function ($cookieStore) {
   var _user = $cookieStore.get('starter.user');
   var setUser = function (user) {
      _user = user;
      $cookieStore.put('starter.user', _user);
   };

   return {
      setUser: setUser,
      isLoggedIn: function () {
         return _user ? true : false;
      },
      getUser: function () {
         return _user;
      },
      logout: function () {
         $cookieStore.remove('starter.user');
         _user = null;
      }
   };
});
