var app = angular.module('app', []).
    config(['$routeProvider', function($routeProvider){
        $routeProvider
            .when('/user/:userId', { controller: 'UserController', templateUrl: 'user.html' })
            .when('/users', {controller: 'UsersController', templateUrl: 'users.html'})
            .otherwise({redirectTo: '/users'});
    }]);

function UserController($scope, $routeParams){
    console.log('user');
}

function UsersController($scope){
    console.log('users');
}
