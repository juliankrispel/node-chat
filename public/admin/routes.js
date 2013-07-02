define(['angular', 'controllers'], function(angular){
    'use strict';
    return angular.module('app.routes', ['app.controllers']).config(['$routeProvider', function($routeProvider){
        $routeProvider
        .when('/user/:userId', { controller: 'UserController', templateUrl: 'user.html' })
        .when('/users', {controller: 'UsersController', templateUrl: 'users.html'})
        .otherwise({redirectTo: '/users'});
    }]);
});
