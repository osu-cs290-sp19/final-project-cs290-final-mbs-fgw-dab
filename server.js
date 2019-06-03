var express = require('express')
var bcrypt = require('bcrypt')
var http = require('http');
var https = require('https');
var fs = require('fs')

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

// This section highly based on stackoverflow post:
// https://stackoverflow.com/questions/7450940/automatic-https-connection-redirect-with-node-js-express
var httpApp = express()
httpApp.get('*', function (req, res){
	res.redirect('https://' + req.headers.host + req.url)
})
var httpServer = http.createServer(httpApp)

var httpsServer = https.createServer({
	key: fs.readFileSync('certs/key.pem'),
	cert: fs.readFileSync('certs/cert.pem'),
}, app)

db.preDatabase("mongodb://localhost:27017/", "CS290", function(){
	httpServer.listen(HTTPPORT)
	httpsServer.listen(HTTPSPORT)
})