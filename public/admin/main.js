require.config({
    paths: {
        angular: '../components/angular/angular',
        text: '../components/require/text',
        socketio: '../components/socket.io-client/dist/socket.io.min'
    },
    baseUrl: 'admin/',
    shim: {
        'socketio': {'exports': 'io'},
        'angular' : {'exports' : 'angular'},
        'angularMocks': {deps:['angular'], 'exports':'angular.mock'}
    },
    priority: [
        "angular"
    ]
});

require( [
    'angular',
    'app',
    'routes'
    ], function(angular, app, routes) {
        'use strict';
        angular.bootstrap(document, [app['name']]);
    });
