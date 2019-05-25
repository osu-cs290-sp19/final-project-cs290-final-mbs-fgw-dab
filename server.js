var express = require('express')
var bcrypt = require('bcrypt')
var http = require('http');
var https = require('https');

var auth = require('./scripts/auth')

var HTTPPORT = 80
var HTTPSPORT = 443



var app = express();

app.use(express.static("public"))

app.get('/login', function (req, res){
	
	auth.loginUser(req, res)
	
})

app.use(function(req, res, next){
	auth.validateUser(req, function(userID){
		res.locals.userID = userID;
		next();
	})
})

app.get('/logout', function (req, res){
	
	auth.logoutUser(req, res)
	
})

app.get('/signup', function (req, res){
	
	auth.signupUser(req, res)
	
})

var httpServer = http.createServer(app)
httpServer.listen(HTTPPORT)