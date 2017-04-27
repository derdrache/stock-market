var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const mongoClient = require("mongodb").MongoClient;

const dburl = "mongodb://webapps:webapps@ds157500.mlab.com:57500/webapps";




/* Middelwares */
app.use(express.static(__dirname+"/page"));
app.use(bodyParser.json());










app.listen((process.env.PORT||8080|| 5000), function(){
    console.log("roger, we are online...");
})