var express = require('express')
var bcrypt = require('bcrypt')
var http = require('http');
var https = require('https');

var mongo = require('mongodb');

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var auth = require('./scripts/auth')
var posts = require('./scripts/posts')
var db = require('./scripts/mongodb')

var HTTPPORT = 80
var HTTPSPORT = 443

var database;

var app = express();

app.use(cookieParser())
app.use(bodyParser.json())

app.use(express.static("public"))

app.post('/login', function (req, res){
	
	auth.loginUser(req, res)
	
})

app.post('/signup', function (req, res){
	
	auth.signupUser(req, res)
	
})

app.use(function(req, res, next){

	auth.validateUser(req, function(userID){
		res.locals.userID = userID;
		next();
	})
})

app.post('/logout', function (req, res){
	
	auth.logoutUser(req, res)
	
})

app.post('/new/:type', function(req, res){
	posts.handleNew(req, res)
})

app.get('/get/all', function(req, res){
	req.params.id = 'all'
	posts.handleGet(req, res)
})

app.get('/get/:type/:id', function(req, res){
	posts.handleGet(req, res)
})

var httpServer = http.createServer(app)

db.preDatabase("mongodb://localhost:27017/", "CS290", function(){
	httpServer.listen(HTTPPORT)
})