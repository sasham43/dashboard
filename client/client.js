var app = angular.module('dashboardApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'HomeController'
    })
    .when('/settings', {
      templateUrl: '/views/settings.html',
      controller: 'SettingsController'
    });

  $locationProvider.html5Mode(true);
}]);

app.controller('HomeController', ['$http', function($http){
  console.log('home controller loaded');
}]);

app.controller('SettingsController', ['$http', function($http){
  console.log('settings controller loaded');
}]);
