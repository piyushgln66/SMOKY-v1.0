// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ion-autocomplete'])

.run(function($ionicPlatform, $rootScope, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // do the initializations here


    Parse.initialize("CafHVr2BKB0gxka3A88VonegjFn5JJHRwT3eQcOl", "Xrt7svHE59g4Awphs5gabDKf14QEIww01SEZEplM");

  });


})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('login', {
    url: '/',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })


  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    },
    //if the user is not logged in, don't allow to visit this page
    onEnter: function($state, Auth){
        if(!Auth.isLoggedIn()){
           $state.go('login');
        }
    }
  })

  .state('tab.friends', {
    url: '/friends',
    views: {
      'tab-friends': {
        templateUrl: 'templates/friends.html',
        controller: 'FriendsCtrl'
      }
    },
    //if the user is not logged in, don't allow to visit this page
    onEnter: function($state, Auth){
        if(!Auth.isLoggedIn()){
           $state.go('login');
        }
    }
  })

  .state('tab.newSmoke', {
      url: '/newSmoke',
      views: {
        'tab-newSmoke': {
          templateUrl: 'templates/newSmoke.html',
          controller: 'NewSmoke'
        }
      },
      //if the user is not logged in, don't allow to visit this page
      onEnter: function($state, Auth){
          if(!Auth.isLoggedIn()){
             $state.go('login');
          }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    },
    //if the user is not logged in, don't allow to visit this page
    onEnter: function($state, Auth){
        if(!Auth.isLoggedIn()){
           $state.go('login');
        }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/");

});
