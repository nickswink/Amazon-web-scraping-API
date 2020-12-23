"use strict";
var express = require('express'); //import express, because I want easier management of get and post requests.  

var app = express();  //the express method returns an instance of a app object
app.use(bodyParser.urlencoded({ extended: false }));  //use this because incoming data is urlencoded

// CORS Headers
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();  //go process the next matching condition
});


//supporting functions go here


//terminalWrite is the last supporting function to run.  It sends 
// output to the API consumer and ends the response.
// This is hard-coded to always send a json response.
var terminalWrite = function (res, Output, responseStatus) {
    res.writeHead(responseStatus, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(Output));
    res.end();
};

//app event handlers go here
app.get('/', function (req, res) {
    //what to do if request has no route ... show instructions
    var message = [];
    message[0] = "Instructions go here.";
    message[1] = "More instructions go here.";
    terminalWrite(res, message, 200);
});

//This piece of code creates the server  
//and listens for a request on a port
//we are also generating a console message once the 
//server is created
var server = app.listen(8200, function () {
    var port = server.address().port;
    console.log("The server is listening on port:" + port);
});