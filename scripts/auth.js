
var crypto = require('crypto')
var bcrypt = require('bcrypt')

var mongo = require('./mongodb')
var mongobase = require('mongodb')

var tokens = {}
var users = {}
var usernameReverseLookup = {}
var currID = 1;

function getExpiry(){
	var expiry = new Date();
	expiry.setHours(expiry.getHours() + 1);
	return expiry;
}

function validUsername(username){
	if (username.length < 3) return false;
	
	return true;
}

async function newUser(username, passwordHash, callback){
	
	var newUser = {username: username, password: passwordHash}
	
	mongo.getDB().collection("users").insertOne(newUser, function(err, doc){
		if (err == undefined){
			console.log("New user registered: " + username)
			callback(undefined)
		}else{
			console.log("An error has occured during user registration")
			console.log(err)
			callback(err)
		}
	})
}

async function getUserByID(userID, callback){
	mongo.getDB().collection("users").findOne({_id: mongo.makeObjectID(userID)}, function(err, doc){
		if (!err){		
			callback(doc)
		}else{
			callback(undefined)
		}
	})
}

async function getUserByUsername(username, callback){
	mongo.getDB().collection("users").findOne({username: username}, function(err, doc){
		if (!err){		
			callback(doc)
		}else{
			callback(undefined)
		}
	})
}

async function addToken(userID, token){
	var newToken = {userID: userID, token: token}
	
	mongo.getDB().collection("tokens").insertOne(newToken, function(err, doc){
		if (err){
			console.log("An error occured while storing a token for userID = " + String(userID))
		}
	})
}

async function removeToken(userID, callback){
	mongo.getDB().collection("tokens").deleteMany({userID: mongo.makeObjectID(userID)}, function(err, doc){
		if (err){
			callback()
		}else{
			callback()
		}
	})
}

async function getToken(userID, callback){
	mongo.getDB().collection("tokens").findOne({userID: mongo.makeObjectID(userID)}, function(err, doc){
		if (err == null && doc != null){		
			callback(doc.token)
		}else{
			callback(undefined)
		}
	})
}

async function newSession(userID, callback){
	// Generate a new session for this user
	var token = new Buffer(crypto.randomBytes(64)).toString('base64');
	
	var startDate = new Date();
	 // 1 hour expiry
	var endDate = getExpiry();
	
	// Only 8 rounds because its a token not a password + rainbow table non-viable due to randomness of tokens
	// Also it improves the responsiveness of the website and using bcrypt is already quite overkill
	bcrypt.genSalt(8, function(err, salt){
		bcrypt.hash(token, salt, function(err, hash){
			
			var clientToken = {token: token, expires: endDate}
			var serverToken = {userID: userID, token: hash, startDate: startDate, endDate: endDate}
			
			addToken(userID, serverToken);
			
			callback(clientToken)
		})
	})
}

async function validateUser(req, callback){
	var userID = req.cookies.userID
	var token = req.cookies.token;
	
	getToken(userID, function(serverToken){
	
		if (serverToken != undefined && userID != undefined && token != undefined){
			bcrypt.compare(token, serverToken.token, function(err, correct){
				if (correct){

					var date = new Date();
					
					if (date < serverToken.startDate || date > serverToken.endDate){
						removeToken(userID, function(){})
						
						callback(-1)
						return;
					}
					
					// If the token is good and the date is good, we are good
					callback(userID)
					
				}else{
					callback(-1)
					return;
				}
			})
		}else{
			callback(-1)
			return;
		}
	})
}

async function loginUser(req, res){
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	getUserByUsername(username, function(user){

		if (user != undefined){

			var userID = user._id;
			
			bcrypt.compare(password, user.password, function(err, correct){
				
				if (correct){
					
					removeToken(userID, function(){
				
						newSession(userID, function(session){
						
							res.cookie("userID", userID.toString(), {expires: session.expires, path: '/'});
							res.cookie("username", username, {expires: session.expires, path: '/'})
							res.cookie("token", session.token, {expires: session.expires, path: '/'});
							res.writeHead(200);
							res.end();
							
						})
						
					})
				}else{
					
					res.writeHead(401);
					res.end();
					
				}
					
			})
			
		}else{
			res.writeHead(401)
			res.end()
		}
	})
}

async function logoutUser(req, res){
	var userID = res.locals.userID
	
	if (userID == -1){
		// Fail fast
		console.log("User not logged in")
		res.writeHead(401);
		res.end();
	}else{
		removeToken(userID, function(){})
		res.writeHead(200)
		res.end();
	}
}

async function signupUser(req, res){
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	getUserByUsername(username, function(user){
	
		var usernameUsed = user != undefined;
		
		if (usernameUsed || !validUsername(username)){
			res.writeHead(409)
			res.end();
		}else{
			bcrypt.genSalt(12, function(err, salt){
				bcrypt.hash(password, salt, function(err, hash){
				
					newUser(username, hash, function(){
						// Don't know if we should do this; currently try to login,

						loginUser(req, res)
					})
					
				})
			})
		}
	})
}

module.exports = {
	validateUser: validateUser,
	loginUser: loginUser,
	logoutUser: logoutUser,
	signupUser: signupUser
}