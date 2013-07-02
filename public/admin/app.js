define(['angular', 'socket', 'routes', 'controllers'], function(angular){
    'use strict';
    var app = angular.module('app', ['app.routes', 'app.socket']);
    return app;
});
