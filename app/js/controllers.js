angular.module('OneDayTrip.controllers', [])
.controller('tripsController', function($scope, oneDayTripHook) {
    oneDayTripHook.register('data_arrived',function(data){
        $scope.tripList = data;
        return true;
    });

    $scope.tripClicked = function(data){
        oneDayTripHook.call('trip_clicked',data);
    }
  }
)
.controller('paramsController',function($scope, oneDayTripData, 
                                                oneDayTripUtils,
                                                start_coord,
                                                oneDayTripHook,
                                                oneDayTripMapApi,
                                                oneDayTripFakeData,
                                                oneDayTripHttpApi){
    
    $scope.activities = oneDayTripData.getActivities();
    $scope.topics = oneDayTripData.getTopics();
     
    $scope.activity = $scope.activities[0];
    $scope.selected_topics = [$scope.topics[0]];
    $scope.budget_from = 0;
    $scope.budget_to = 500;
    
    $scope.setFreeBudget = function(checked){
        if(checked){
            $scope.budget_from = null;
            $scope.budget_to = null;
        }else{
            $scope.budget_from = 0;
            $scope.budget_to = 500;
        }
    }
    
    $scope.getTrips = function() {
        var activity = $scope.activity.key;
        var budgets = [$scope.budget_from || 0,$scope.budget_to || 0];
        var startPointName
        var coordinates = []

        var topics = [];
        angular.forEach($scope.selected_topics, function(val){
            topics.push(val.key);
        });

        oneDayTripMapApi.getLocationNameByCoordinate(start_coord,function(result){
            var query = oneDayTripUtils.buildQueryString({
                activity:activity,
                startPointName:result,
                coordinates:[start_coord.lat,start_coord.lng].join(','),
                topics:topics.join(','),
                budget:budgets.join(',')
            });
            //var result = oneDayTripFakeData.getFakeTrips();
            var result = oneDayTripHttpApi.getTrips(query)
            oneDayTripHook.call('data_arrived',result.trips);
        })
    }

    $scope.test = function() {
        console.log("ev: " + $event)
    }
})
.controller('mapController',function($scope, oneDayTripHook, start_coord,oneDayTripUtils, oneDayTripMapApi){
    oneDayTripHook.register('trip_clicked',function(attractions){
        oneDayTripMapApi.drawPaths(oneDayTripUtils.getCoordsFromAttr(attractions));
        return true;
    }); 
    $scope.initMap = function(){
        oneDayTripMapApi.setCurrentCoordinates(start_coord);
    }
})
.controller('tripDetailsController', function($scope, oneDayTripHook){
    oneDayTripHook.register('trip_clicked',function(attractions){
            $scope.attractions = attractions
            $scope.visible = attractions.length;
            return true;
    });
    $scope.attractionClicked = function(data){
            oneDayTripHook.call('attraction_clicked',data);
        }
})
.controller('tripAttractionPoint', function($scope, oneDayTripHook) {
    oneDayTripHook.register('attraction_clicked', function(attraction){
        $scope.attraction=attraction
    })
})