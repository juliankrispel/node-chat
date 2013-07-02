define(['angular', 'app'], function(angular, app){
    'use strict';

    return app.config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/user/:userId', {
            templateUrl: 'user.html', 
            controller: 'UserController'
        })
        .when('/users', {
            templateUrl: 'users.html', 
            controller: 'UsersController'
        })
        .otherwise({redirectTo: '/users'});
    }]);
});
