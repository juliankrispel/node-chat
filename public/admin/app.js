define(['angular', 'socket', 'controllers'], function(angular, socket, controllers){
    'use strict';

    return angular.module('app', ['app.socket', 'app.controllers']);
});
