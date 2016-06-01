var windowingApp = angular.module('windowingApp', [
  'windowingControllers',
  'windowingServices',
  'angular-loading-bar',
  'ngAnimate',
]);

windowingApp.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

// global app vars
var server = 'http://brainviz1.cs.jhu.edu/';
//var server = 'http://localhost:8000/';
