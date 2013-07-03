define(['angular', 'socket'], function(angular, socket){
    'use strict';

    return angular.module('app.controllers', ['app.socket']).
        controller('UserController', ['$scope', '$routeParams', 'socket', function($scope, $routeParams, socket){
            socket.emit('user:get', {user: $routeParams.userId});
            socket.on('user:get', function(data){
                console.log(data);
            });
        }])
        .controller('UsersController', ['$scope', 'socket', function($scope, socket){
            socket.emit('users:get');
            socket.on('users:get', function(data){
                $scope.users = data;
            });
        }]);
});
