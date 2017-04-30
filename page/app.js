var app = angular.module('app', ["ngRoute", "ngCookies"]);


app.config(function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl: '/home/home.html',
        controller: "homeController"
    })
    
});

