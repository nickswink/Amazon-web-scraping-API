"use strict";
var express = require('express'); //import express, because I want easier management of get and post requests.  
var bodyParser = require('body-parser');
const { spawn } = require('child_process');


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

//ERROR trapping
app.get('/getitem', function (req, res, next) {
    let url = req.query.url;
    if (url == undefined) {
        terminalWrite(res, 'Request failed. No url provided', 500);
        return;
    }
    // no errors move on
    next();
})


//app event handlers go here
app.get('/', function (req, res) {
    //what to do if request has no route ... show instructions
    var message = [];
    message[0] = "GET /getitem provide url returns productTitle, productPrice, productAvailability";
    message[1] = "";
    terminalWrite(res, message, 200);
});

app.get('/getitem', function (req, res) {
    let dataToSend = [];
    let url = req.query.url;
    try {
        // spawn new child process to call the python script
        const python = spawn('python', ['scrape.py', url]);
        // collect data from script
        python.stdout.on('data', function (data) {
            console.log('Pipe data from python script ...');
            dataToSend = data.toString();
        });
        // in close event we are sure that stream from child process is closed
        python.on('close', (code) => {
            console.log(`child process close all stdio with code ${code}`);
            // send data to browser
            terminalWrite(res, JSON.parse(dataToSend), 200);
        });
    } catch (e) {
        console.log(e);
        terminalWrite(res, 'Internal server error with python script', 500);
    }
});

//This piece of code creates the server  
//and listens for a request on a port
//we are also generating a console message once the 
//server is created
var server = app.listen(8222, function () {
    var port = server.address().port;
    console.log("The server is listening on port:" + port);
});