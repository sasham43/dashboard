var app = angular.module('dashboardApp', ['ngRoute', 'uiGmapgoogle-maps']);

app.config(['$routeProvider', '$locationProvider', 'uiGmapGoogleMapApiProvider', function($routeProvider, $locationProvider, uiGmapGoogleMapApiProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/views/home.html',
      controller: 'HomeController',
      controllerAs: 'hc'
    })
    .when('/settings', {
      templateUrl: '/views/settings.html',
      controller: 'SettingsController',
      controllerAs: 'sc'
    });

  $locationProvider.html5Mode(true);

  uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.22', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization, geocoding'
    });
}]);

/////////////////////////////////////////////
//    Home Controller
/////////////////////////////////////////////

app.controller('HomeController', ['uiGmapIsReady', 'LocationService', 'TransitService', 'WeatherService', 'CalendarService', '$http', function(uiGmapIsReady, LocationService, TransitService, WeatherService, CalendarService, $http){
  console.log('home controller loaded');
  var hc = this;
  hc.gmap = uiGmapIsReady;

  // location
  hc.location = LocationService.location;

  // time
  hc.time = moment().format('hh:mm A');

  // attire icons
  hc.umbrellaURL = 'assets/images/attire/umbrella-light.png';
  hc.shortsURL = 'assets/images/attire/shorts-light.png';
  hc.pantsURL = 'assets/images/attire/pants-light.png';
  hc.jacketURL = 'assets/images/attire/jacket-light.png';
  hc.mittensURL = 'assets/images/attire/mitten-light.png';
  hc.tshirtURL = 'assets/images/attire/tshirt-light.png';

  // get transit info
  hc.stops = TransitService.savedStops;
  hc.selectedDepartureStop = {};
  hc.departures = TransitService.departures;
  hc.busMarker = {id:0, coords: {lat: 0, lng: 0}};
  hc.homeMarker = {id: 1, coords: {lat: 44.96641779999999, lng: -93.28213879999998}};
  //hc.markers = [hc.busMarker, hc.homeMarker];
  hc.markers = [{id:0, coords: {lat: 0, lng: 0}}, {id: 1, coords: {lat: 44.96641779999999, lng: -93.28213879999998}} ];

  // get data from factories
  hc.eventList = CalendarService.events;
  hc.conditions = WeatherService.conditions;
  hc.hourly = WeatherService.hourly;
  hc.latLng = LocationService.latLng;

  hc.updateMap = function(){
    // hc.gmap.then(function(maps){
    //   LocationService.getLocation();
    //   hc.map.center = hc.latLng;
    //   hc.map.zoom = 12;
    //   if(hc.departures.length != 0){
    //     hc.departures[0].coords = {lat: hc.departures[0].lat, lng: hc.departures[0].lng};
    //   }
    //   console.log('map object', hc.map);
    //   console.log('hc.latLng object', hc.latLng);
    // });
  //   hc.gmap.promise(1).then(function(instances) {
  //       instances.forEach(function(inst) {
  //           var map = inst.map;
  //           var uuid = map.uiGmap_id;
  //           var mapInstanceNumber = inst.instance; // Starts at 1.
  //           map.center = hc.latLng;
  //           map.zoom = 12;
  //           console.log('Maps are ready:', map, uuid, mapInstanceNumber);
  //       });
  //   });
  // };

  // var thisMap = hc.gmap.getGMap();
  // console.log('thisMap', thisMap);

  hc.getDepartureInfo = function(){
    TransitService.getDepartureInfo(hc.selectedDepartureStop.route, hc.selectedDepartureStop.direction, hc.selectedDepartureStop.value);
    hc.updateMap();
  };

  // google maps
  hc.map = { center: { latitude: 45, longitude: -73 }, zoom: 5 };



  hc.logMaps = function(){
    console.log('latLng:', hc.latLng);
    //hc.map.center = hc.latLng;
  }

  CalendarService.getCalendarEvents();
  WeatherService.getWeather();
  TransitService.getAllSavedStops();
  LocationService.getLocation();

  hc.updateMap();

}]);

/////////////////////////////////////////////
//    Settings Controller
/////////////////////////////////////////////

app.controller('SettingsController', ['LocationService', 'TransitService', function(LocationService, TransitService){
  console.log('settings controller loaded');
  var sc = this;
  sc.selectedRoute = {};
  sc.selectedDirection = '';
  sc.routes = TransitService.routes;
  sc.cardinalDirections = TransitService.cardinalDirections;
  sc.stops = TransitService.stops;
  sc.createStopResponse = TransitService.createStopResponse;

  // location
  sc.location = {};
  sc.setLocation = function(){
    LocationService.setLocation(sc.location.address, sc.location.city, sc.location.state, sc.location.zip, sc.location.weather, sc.location.transit);
  }

  // transit
  sc.getRoutes = function(){
    TransitService.getRoutes();
  };

  sc.getDirection = function(){
    TransitService.getDirection(sc.selectedRoute);
  }

  sc.getStops = function(){
    TransitService.getStops(sc.selectedRoute, sc.selectedDirection);
  }

  sc.createStop = function(){
    TransitService.createStop(sc.selectedStop, sc.selectedRoute, sc.selectedDirection);
  }
}]);

/////////////////////////////////////////////
//    Transit Service
/////////////////////////////////////////////

app.factory('TransitService', ['uiGmapGoogleMapApi', '$http', function(uiGmapGoogleMapApi, $http){
  var routes = [];
  var northSouth = false;
  var eastWest = false;
  var cardinalDirections = {};
  var stops = [];
  var createStopResponse = {value: 0};
  var savedStops = [];
  var departures = [];

  // save bus stop

  var getRoutes = function(){
    $http.get('/transit/routes').then(function(response){
      console.log('Got routes:', response);
      angular.copy(response.data, routes);
    });
  };

  var getDirection = function(routeID){
    console.log('Getting directions for:', routeID);
    $http.get('/transit/direction/' + routeID.Route).then(function(response){
      console.log('Got directions:', response.data);
      var responseData = response.data;
      if (responseData === 'northSouth'){
        northSouth = true;
        eastWest = false;
      } else {
        eastWest = true;
        northSouth = false;
      }

      angular.copy({eastWest: eastWest, northSouth: northSouth}, cardinalDirections);
      console.log('cardinalDirections', cardinalDirections);
    });
  };

  var getStops = function(routeID, directionID){
    console.log('Getting stops for:', routeID, directionID);
    $http.get('/transit/stops/' + routeID.Route + '/' + directionID).then(function(response){
      console.log('Got stops:', response.data);
      angular.copy(response.data, stops);
    });
  };

  var createStop = function(stop, route, direction){
    var newStop = {name: stop.Text , value: stop.Value, route: route.Route, direction: direction};
    $http.post('/transit/create', newStop).then(function(response){
      console.log('Stop saved.', response.status);
      createStopResponse.value = response.status;
    }, function(response){
      console.log('Stop not saved.', response.status);
      createStopResponse.value = response.status;
    });
  };

  // get stop info

  var getAllSavedStops = function(){
    $http.get('/transit/all').then(function(response){
      console.log('Retrieved stops from database:', response);
      angular.copy(response.data, savedStops);
    });
  };

  var getDepartureInfo = function(routeID, directionID, stopID){
    console.log('Getting departure info for:', routeID, directionID, stopID);
    $http.get('/transit/departure/' + routeID + '/' + directionID + '/' + stopID).then(function(response){
      console.log('Got departure info:', response.data);
      var responseData = response.data;
      angular.copy(response.data, departures);
      // google maps
      // uiGmapGoogleMapApi.then(function(maps){
      //   var geocoder = new maps.Geocoder();
      //   var addressString = '28th Ave Station MN';
      //   geocoder.geocode({address: addressString}, function(results, status){
      //     console.log('Bus stop geocode results:', results);
      //     console.log('Bus stop geocode status:', status);
      //   })
      // });
    });
  };




  return {
    getRoutes: getRoutes,
    routes: routes,
    getDirection: getDirection,
    cardinalDirections: cardinalDirections,
    getStops: getStops,
    stops: stops,
    createStop: createStop,
    createStopResponse: createStopResponse,
    getAllSavedStops: getAllSavedStops,
    savedStops: savedStops,
    getDepartureInfo: getDepartureInfo,
    departures: departures
  }
}]);

/////////////////////////////////////////////
//    Calendar Service
/////////////////////////////////////////////

app.factory('CalendarService', ['$http', function($http){
  var events = [];

  var getCalendarEvents = function(){
    $http.get('/calendar').then(function(response){
      console.log('client side calendar response:', response);
      var tempEvents = [];
      // loop through eventList and format times
      response.data.map(function(event){
        var tempStart = moment(event.start).format('HH:mm');
        var tempEnd = moment(event.end).format('HH:mm');
        tempEvents.push({title: event.title, start: tempStart, end: tempEnd});
      });
      angular.copy(tempEvents, events);
    });
  }

  return {
    events: events,
    getCalendarEvents: getCalendarEvents
  }
}]);

/////////////////////////////////////////////
//    Weather Service
/////////////////////////////////////////////

app.factory('WeatherService', ['$http', function($http){
  var hourly = [];
  var conditions = {};

  var getWeather = function(){
    $http.get('/weather').then(function(response){
      console.log('client side weather response:', response);
      angular.copy(response.data.conditionObject, conditions);
      angular.copy(response.data.hourlyList, hourly);
    });
  }

  return {
    hourly: hourly,
    conditions: conditions,
    getWeather: getWeather
  }
}]);

/////////////////////////////////////////////
//    Location Service
/////////////////////////////////////////////

app.factory('LocationService', ['uiGmapGoogleMapApi', '$http', function(uiGmapGoogleMapApi, $http){
  var locationResponseStatus = 0;
  var location = {};
  var latLng = {};

  var setLocation = function(address, city, state, zip, weather, transit){
    var location = {address: address, city: city, state: state, zip: zip, weather: weather, transit: transit};
    $http.post('/location', location).then(function(response){
      console.log('location posted successfully');
      locationResponseStatus = response.status;
    });
  };

  var getLocation = function(){
    $http.get('/location').then(function(response){
      console.log('Retrieved location:', response);
      angular.copy(response.data, location);
      // google maps
      uiGmapGoogleMapApi.then(function(maps) {
        console.log('factory location:', location);
        var geocode = new maps.Geocoder();
        var addressString = location.address + " " + location.city + " " + location.state + " " + location.zip;
        console.log('addressString:', addressString);
        geocode.geocode({address: addressString}, function(results, status){
          //console.log('geocode results:', results);
          //console.log('geocode status:', status);
          var latitude = results[0].geometry.location.lat();
          var longitude = results[0].geometry.location.lng();
          angular.copy({latitude: latitude, longitude: longitude}, latLng);
        });
      });
    });
  };




  return {
    setLocation: setLocation,
    locationResponseStatus: locationResponseStatus,
    getLocation: getLocation,
    location: location,
    latLng: latLng
  }
}]);
