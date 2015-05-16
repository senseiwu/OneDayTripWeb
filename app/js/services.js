angular.module('OneDayTrip.services', []).
  factory('oneDayTripHttpApi', function($http) {

    var http = {};

    http.getTrips = function() {
      return $http({
        method: 'GET',
        url: 'url'
      });
    }
    
    return http;
  })
  .factory('oneDayTripHook',function(){
      var hook = {
            hooks: [],
            register: function ( name, callback ) {
                if('undefined' === typeof( hook.hooks[name])){
                    hook.hooks[name] = [];
                }     
                hook.hooks[name].push( callback )
            },
            call: function ( name, args ) {
                if( 'undefined' !== typeof( hook.hooks[name] ) ){
                    for( i = 0; i < hook.hooks[name].length; ++i ){
                        if( true !== hook.hooks[name][i]( args ) ) 
                        { 
                           break; 
                        }
                    }
                }    
            }
        }
        return hook;
  })
  .factory('oneDayTripMapApi', function(){
      geocoder = new google.maps.Geocoder();
      
      var mapApi = {
          el:document.getElementById('trip-map'),
          zooming:8,
          directionService: new google.maps.DirectionsService(),
          directionRenderer: new google.maps.DirectionsRenderer( {'draggable':true} )
      };
      
      mapApi.getLocationNameByCoordinate = function(coords,callback){
          var latlng = new google.maps.LatLng(coords.lat, coords.lng);
          geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
             if (results[1]) {
                callback(results[1].formatted_address);
             }
          }
        });
      }
      
      mapApi.drawPaths = function(coords){
          mapApi.getLocationNameByCoordinate(coords[0], function(origin){
              mapApi.getLocationNameByCoordinate(coords[coords.length -1], function(destination){
                  var points = [];
                  for ( var i=1; i<coords.length-1; i++ ) 
                  {
                      points.push({
                          location:new google.maps.LatLng(coords[i].lat,coords[i].lng),
                          stopover:true
                      });
                  }
                  var request = {
                    origin: origin,
                    destination: destination,
                    waypoints: points,
                    optimizeWaypoints: true,
                    travelMode: google.maps.TravelMode.DRIVING
                  };
                  mapApi.directionService.route(request, function(res, stat) {
                    if (stat === google.maps.DirectionsStatus.OK) {
                        mapApi.directionRenderer.setDirections(res); 
                    }
                  });
              })
          }) 
      }
      
      mapApi.setCurrentCoordinates = function(coord){
          mapApi.map = new google.maps.Map(mapApi.el, {
                center: coord,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoom: mapApi.zooming
          });
          mapApi.directionRenderer.setMap( mapApi.map);
      }
      
      return mapApi;
  })
  .factory('oneDayTripUtils',function(){
      var utils = {};
      
      utils.buildQueryString=function(data){
        if ( ! angular.isObject( data ) ) { 
            return( ( data === null ) ? "" : data.toString() ); 
        }
        var buffer = [];
        for ( var name in data ) 
        { 
            if ( ! data.hasOwnProperty( name ) ) { 
                continue; 
            }
            var value = data[ name ];

            buffer.push(
                encodeURIComponent( name ) + "=" + encodeURIComponent( ( value === null ) ? "" : value )
            ); 
        }
        return buffer.join( "&" ).replace( /%20/g, "+" );
    }
      
      return utils;
  })
  .factory('oneDayTripData',function(){
      var data={
          getActivities:function(){
              return [
                        {'key':'L','text':'Low'},
                        {'key':'M','text':'Mid'},
                        {'key':'H','text':'High'}
                    ];
          },
          getTopics:function(){
             return [
                        {'key':'HISTORY','text':'History'},
                        {'key':'SHOPPING','text':'Shopping'}
                    ];
          }
      }
      return data;
  })
  .factory('oneDayTripFakeData',function(){
      var data = {
          getFakeTrips: function() {
            var trips = {
                "trips": [
                    {
                        "id": 1,
                        "duration": '12h',
                        "totalCost": 500,
                        "attractions": [
                            {
                                "order": 1,
                                "name": 'Epam',
                                "imageURL": null,
                                "rating": 0,
                                "timing": 0,
                                "price": null,
                                "attractionType": null,
                                "coordinate": {
                                    "xCoordinate": "113.955133",
                                    "yCoordinate": "22.533188"
                                }
                            },
                            {
                                "order": 2,
                                "name": "Coco park",
                                "imageURL": "http://startinchina.com/shenzhen/shopping/coco_park.html",
                                "rating": 3,
                                "timing": 4,
                                "price": 500,
                                "attractionType": "SHOPPING",
                                "coordinate": {
                                    "xCoordinate": "113.957307",
                                    "yCoordinate": "22.530676"
                                }
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "duration": '6h',
                        "totalCost": 200,
                        "attractions": [
                            {
                                "order": 1,
                                "name": 'Park',
                                "imageURL": null,
                                "rating": 0,
                                "timing": 0,
                                "price": null,
                                "attractionType": null,
                                "coordinate": {
                                    "xCoordinate": "113.955133",
                                    "yCoordinate": "22.533188"
                                }
                            },
                            {
                                "order": 2,
                                "name": "Coco park",
                                "imageURL": "http://startinchina.com/shenzhen/shopping/coco_park.html",
                                "rating": 3,
                                "timing": 4,
                                "price": 500,
                                "attractionType": "SHOPPING",
                                "coordinate": {
                                    "xCoordinate": "113.957307",
                                    "yCoordinate": "22.530676"
                                }
                            }
                        ]
                    }
                ]
            };
            
            return trips;
        },
          getFakePoints: function() {
            var points = [
                {
                    id: "1",
                    name: "Fantastic place for boys",
                    points:
                            [{
                                    id: "1",
                                    type: "hist",
                                    coordinate: {lon: "114.24270629882812", lat: "22.741989621606027"},
                                    comments: "this place is awesome!",
                                    price:"100",
                                    duration:"2h",
                                    pictureUrl:""
                                },
                                {
                                    id: "2",
                                    type: "hist",
                                    coordinate: {lon: "114.28321838378906", lat: "22.730907082662497"},
                                    comments: "this place is not so good!",
                                    price:"200",
                                    duration:"3h",
                                    pictureUrl:""
                                },
                                {
                                    id: "3",
                                    type: "hist",
                                    coordinate: {lon: "114.3460464477539", lat: "22.689181188747252"},
                                    comments: "hate it!!!!",
                                    price:"400",
                                    duration:"5h",
                                    pictureUrl:""
                                }
                            ]
                },
                {
                    id: "2", name: "For lesbians",
                    points:
                            [{
                                    id: "1",
                                    type: "hist",
                                    coordinate: {lon: "114.35729026794434", lat: "22.654017060763145"},
                                    comments: "this place is awesome!",
                                    price:"12",
                                    duration:"15m",
                                    pictureUrl:""
                                },
                                {
                                    id: "2",
                                    type: "hist",
                                    coordinate: {lon: "114.4717025756836", lat: "22.5737552844127"},
                                    comments: "this place is not so good!",
                                    price:"2000",
                                    duration:"13h",
                                    pictureUrl:""
                                },
                                {
                                    id: "3",
                                    type: "hist",
                                    coordinate: {lon: "114.51152801513672", lat: "22.44879309308878"},
                                    comments: "hate it!!!!",
                                    price:"0",
                                    duration:"4h",
                                    pictureUrl:""
                                }
                            ]
                }
            ];
            return points;
        }
    }
    return data;
  })