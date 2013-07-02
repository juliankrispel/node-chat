define(['angular', 'socket'], function(angular){
    'use strict';

    return angular.module('app.controllers', ['app.socket']).
        controller('UserController', ['$scope', '$routeParams', 'socket', function($scope, $routeParams, socket){
        
        }])
        .controller('UsersController', ['$scope', 'socket', function($scope, socket){
            socket.emit('user:get');
            socket.on('user:get', function(data){
//                $scope.users = data;
                $scope.users = [{name: 'Julian', email: 'julian@outeredgeuk.com'}];
            });
        }]);
});
