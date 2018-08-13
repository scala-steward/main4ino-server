var webPortalApp = angular.module('webPortalApp', ['ui.router']);

webPortalApp.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/home');
    
    // Examples from https://scotch.io/tutorials/angular-routing-using-ui-router

    $stateProvider
        
        .state('home', {
            url: '/home',
            templateUrl: 'partial-home.html'
        })
        
        .state('insert', {
            url: '/insert',
            templateUrl: 'partial-insert.html'
        })
        
        .state('search', {
            url: '/search',
            templateUrl: 'partial-search.html'
        })

        .state('device-history', {
            url: '/device-history',
            templateUrl: 'partial-device-history.html'
        })

        .state('device-summary', {
            url: '/device-summary',
            templateUrl: 'partial-device-summary.html'
        })

        .state('about', {
            url: '/about',
            views: {
                    '': { templateUrl: 'partial-about.html' },
                    'columnProperties@about': { 
                                templateUrl: 'partial-about-table.html',
                                controller: 'AboutController'
                            }
                    }
            
        });
        
});

webPortalApp.controller(
    'AboutController', 
    function($scope, $log, $http) {
    

        $log.log('Creating version request...'); 

        var req = {
            method: 'GET',
            url: '/api/v1/app/properties/'
        };

        $log.log('Executing version request...');

        $http(req).success(
            function(data) {
                $scope.properties = data;
            }
        ).error(
            function(data) {
                $scope.properties = 'unknown';
            }
        );

        $log.log('Executed version request.');
    
    }
);

webPortalApp.controller(
    'SearchController',  
        function($scope, $http, $log) {

            $log.log('Initializing searcher scope...');
            
            $scope.search = function() {
            
                $log.log('Creating search request...'); 

                $log.log('JSON generated: ' + JSON.stringify($scope.request));

                var req = {
                    method: 'POST',
                    url: 'rest/events/searches/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: $scope.request
                };

                $log.log('Executing request...');

                $http(req).success(
                    function(data) {
                        $scope.result = data;
                    }
                ).error(
                    function(data) {
                        $scope.result = {'message':'No valid response found', 'error': data};
                    }
                );

                $log.log('Executed request.');
            
            };

            $scope.addFilter = function() {
                $log.log('Adding filter...'); 
                $scope.request.filters[$scope.request.filters.length] = {'property': '', 'operator': 'EQ', 'values':['']};
            };

            $scope.removeFilter = function() {
                if ($scope.request.filters.length > 1) {
                    $log.log('Removing filter...');
                    $scope.request.filters.splice($scope.request.filters.length - 1, 1);
                }
            };

            $scope.show = function(arg) {
                $log.log('Showing event ' + arg + ": " + JSON.stringify($scope.result.events[arg], null, '\t'));  
                BootstrapDialog.show({
                    title: 'Event',
                    message: JSON.stringify($scope.result.events[arg], null, '\t')
                });

            };

            // Initialization of search parameters
            $scope.request = {};
            $scope.request.filters = [
                {'property': 'type', 'operator': 'EQ', 'values': ['ObjectEvent']} ,
                {'property': 'eventTime', 'operator': 'LT', 'values': ['2038-02-05 13:43:09.432+0100']} ,

            ];
            
            
            $scope.request.order = {
                'property': 'eventTime',
                'direction': 'ASC'
            };

            $scope.request.pagination = {
                'documents': 20,
                'page': 0
            };
                        

            $log.log('Initialized searcher scope.');
        }
);


webPortalApp.controller(
    'InsertController',
        function($scope, $http, $log) {

            $log.log('Initializing inserter scope...');

            $scope.insert = function() {
            
                $log.log('Creating insert request...'); 

                var req = {
                    method: 'POST',
                    url: 'rest/events/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: $scope.request
                };

                $log.log('Executing request...');

                $http(req).success(
                    function(data) {
                        $scope.result = 'Events inserted correctly!';
                    }
                ).error(
                    function(data) {
                        $scope.result = 'Problem inserting events: ' + JSON.stringify(data);
                    }
                );

                $log.log('Executed request');
            
            };

            $scope.initialize = function() {
            
                $log.log('Creating initialize request...'); 

                var req = {
                    method: 'POST',
                    url: 'rest/dbmodel/'
                };

                $log.log('Executing request...');

                $http(req).success(
                    function(data) {
                        $scope.result = 'Schema initialized correctly!';
                    }
                ).error(
                    function(data) {
                        $scope.result = 'Problem initializing schema: ' + JSON.stringify(data);
                    }
                );

                $log.log('Executed request');
            
            };

            // Initialization of insert parameters
            $scope.request = JSON.stringify({
                                "events":[
                                            {
                                                "type": "ObjectEvent",
                                                "eventTime": "2000-01-01 00:00:00.000+0000",
                                                "recordTime": "2000-01-01 00:00:00.000+0000",
                                                "eventTimeZoneOffset": "+00:00",
                                                "bizStep": "urn:epcis",
                                                "disposition": "urn:econnectware",
                                                "readPoint": "urn:econnectware:site",
                                                "bizLocation": "urn:econnectware",
                                                "bizTransList": null,
                                                "extension": null,
                                                "epcList": ["urn:epc:id:sgtin:890189.0004387.03155465"],
                                                "action": "OBSERVE"
                                            }
                                        ]
                            });                        

            $log.log('Initialized inserter scope.');
        }
    
);

webPortalApp.controller(
    'DeviceHistoryController',
        function($scope, $http, $log) {

            $log.log('Initializing searcher scope...');

            $scope.search = function() {
                $log.log('Searching...');
                $log.log('Using device ' + $scope.device + ' with token ' + $scope.token);

                var req = {
                    method: 'GET',
                    url: 'api/v1/devices/' + $scope.device + '/targets',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token ' + $scope.token
                    },
                    data: $scope.request
                };

                $log.log('Executing request...');

                $scope.result = '...';

                $http(req).success(
                    function(data) {
                        $log.log('Found: ' + JSON.stringify(data));
                        $scope.result = data;
                    }
                ).error(
                    function(data) {
                        $scope.result = 'Problem requesting: ' + JSON.stringify(data);
                    }
                );

                $log.log('Executed request.');




            };

            $log.log('Initialized searcher scope.');
        }
);

webPortalApp.controller(
    'DeviceSummaryController',
        function($scope, $http, $log) {

            $log.log('Initializing scope...');

            $scope.search = function() {
                $log.log('Searching...');
                $log.log('Using device ' + $scope.device + ' with token ' + $scope.token);

                var reqReports = {
                    method: 'GET',
                    url: 'api/v1/devices/' + $scope.device + '/reports/summary?consume=false',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token ' + $scope.token
                    },
                    data: $scope.request
                };

                var reqTargets = {
                    method: 'GET',
                    url: 'api/v1/devices/' + $scope.device + '/targets/summary?status=C&consume=false',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token ' + $scope.token
                    },
                    data: $scope.request
                };

                $log.log('Executing requests...');

                $scope.reportsSummary = '{}';
                $scope.targetsSummary = '{}';

                $http(reqReports).success(
                    function(data) {
                        $log.log('Success reports: ' + JSON.stringify(data));
                        $scope.reportsSummary = data;
                    }
                ).error(
                    function(data) {
                        $log.log('Failed reports: ' + data);
                        $scope.reportsSummary = '{}';
                        BootstrapDialog.show({
                            title: 'Error',
                            message: 'Failed to retrieve reports: ' + data
                        });
                    }
                );

                $http(reqTargets).success(
                    function(data) {
                        $log.log('Success targets: ' + JSON.stringify(data));
                        $scope.targetsSummary = data;
                    }
                ).error(
                    function(data) {
                        $log.log('Failed targets: ' + data);
                        $scope.targetsSummary = '{}';
                        BootstrapDialog.show({
                            title: 'Error',
                            message: 'Failed to retrieve targets: ' + data
                        });
                    }
                );

                $log.log('Executed requests.');

            };

            $scope.changeRequest = function(device, actor, pname, pvalue) {
                $log.log('Request to change ' + device + ' ' + actor + ' ' + pname + ' ' + pvalue);

                BootstrapDialog.show({
                    title: 'Change device ' + device + ': actor ' + actor + '/ property ' + pname + " (" + pvalue + ")",
                    message: 'Change property value to: <input type="text" class="form-control" placeholder="'+pvalue+'">',
                    buttons: [{
                        label: 'Change',
                        action: function(dialog) {
                           var v = dialog.getModalBody().find('input').val();
                           $scope.change(device, actor, pname, v);
                           $log.log('Changed to: ' + v);
                           dialog.close();
                        }
                    }, {
                        label: 'Cancel',
                        action: function(dialog) {
                           $log.log('Cancelled');
                           dialog.close();
                        }
                    }]
                });

            }

            $scope.change = function(device, actor, pname, pvalue) {
                $log.log('Changing ' + device + ' ' + actor + ' ' + pname + ' ' + pvalue);

                var jsn = {};
                jsn[pname] = pvalue;
                var req = {
                    method: 'POST',
                    url: '/api/v1/devices/' + device + '/actors/' + actor + '/targets',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token ' + $scope.token
                    },
                    data: JSON.stringify(jsn)
                };

                $http(req).success(
                    function(data) {
                        $log.log('Success change');
                        $scope.search();
                    }
                ).error(
                    function(data) {
                        $log.log('Failed change');
                    }
                );

            }


            $log.log('Initialized searcher scope.');
        }
);

