var express = require('express')
var bcrypt = require('bcrypt')
var http = require('http');
var https = require('https');

var auth = require('./scripts/auth')

var HTTPPORT = 80
var HTTPSPORT = 443



var app = express();

app.use(function(req, res, next)){
	validateUser(req, function(userID){
		res.locals.userID = userID;
		next();
	})
})

app.get('/login', function (req, res){
	
	loginUser(req, res)
	
})

app.get('/logout', function (req, res){
	
	logoutUser(req, res)
	
})

app.get('/signup', function (req, res){
	
	signupUser(req, res)
	
})

var httpServer = http.createServer(app)
server.listen(HTTPPORT)