var express = require('express')
var bcrypt = require('bcrypt')
var http = require('http');
var https = require('https');

var cookieParser = require('cookie-parser')

var auth = require('./scripts/auth')

var HTTPPORT = 80
var HTTPSPORT = 443



var app = express();

app.use(cookieParser())

app.use(express.static("public"))

app.get('/login', function (req, res){
	
	auth.loginUser(req, res)
	
})

app.get('/signup', function (req, res){
	
	auth.signupUser(req, res)
	
})

app.use(function(req, res, next){
	auth.validateUser(req, function(userID){
		console.log("User: " + userID)
		res.locals.userID = userID;
		next();
	})
})

app.get('/logout', function (req, res){
	
	auth.logoutUser(req, res)
	
})

var httpServer = http.createServer(app)
httpServer.listen(HTTPPORT)