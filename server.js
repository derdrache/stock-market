var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var server = require ("ws").Server;
var s = new server ({port: 8081})
//const mongoClient = require("mongodb").MongoClient;
//const dburl = "mongodb://webapps:webapps@ds157500.mlab.com:57500/webapps";

const webSocketUrl = "ws://dynamic-web-application-projects-derdrache.c9users.io/";



/* Middelwares */
app.use(express.static(__dirname+"/page"));
app.use(bodyParser.json());

s.on("connection", function(ws){
    ws.on("message", function(message){
        
        s.clients.forEach(function e(client){
            client.send(message)
        })
        
        
    })
    
    ws.on("close", function(){
        console.log("i lost a Client")
    })
        
    console.log("one more client connected")
})


app.listen((process.env.PORT || 8080|| 5000), function(){
    console.log("roger, we are online...");
})