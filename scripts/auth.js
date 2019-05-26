
var crypto = require('crypto')
var bcrypt = require('bcrypt')

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

function newUser(username, passwordHash){
	var newID = currID
	currID ++;
	
	users[newID] = {userID: newID, username: username, password: passwordHash};
	
	usernameReverseLookup[username] = newID
}

function getUserByID(userID){
	return users[userID]
}

function getUserByUsername(username){
	var userID = usernameReverseLookup[username]
	
	return getUserByID(userID)
}

function addToken(userID, token){
	tokens[userID] = token
}

function removeToken(userID){
	delete tokens.userID;
}

function getToken(userID){
	return tokens[userID]
}

// Takes a 

async function newSession(userID, callback){
	// Generate a new session for this user
	var token = new Buffer(crypto.randomBytes(32)).toString('base64');
	
	var startDate = new Date();
	 // 1 hour expiry
	var endDate = getExpiry();
	
	bcrypt.genSalt(12, function(err, salt){
		bcrypt.hash(token, salt, function(err, hash){
			
			console.log(err)
			
			var clientToken = {token: token, expires: endDate}
			var serverToken = {userID: userID, token: hash, startDate: startDate, endDate: endDate}
			
			// TODO: Permanent solution for token storage
			addToken(userID, serverToken);
			
			callback(clientToken)
		})
	})
}

async function validateUser(req, callback){
	console.log(tokens)
	
	var userID = req.cookies.userID
	var token = req.cookies.token;
	
	var serverToken = getToken(userID)
	
	if (serverToken != undefined && userID != undefined && token != undefined){
		bcrypt.compare(token, serverToken.token, function(err, correct){
			if (correct){
				
				// Check everything else
				
				var date = new Date();
				
				if (date < serverToken.startDate || date > serverToken.endDate){
					removeToken(userID)
					
					callback(-1)
				}
				
				// If the token is good and the date is good, we are good
				callback(userID)
				
			}else{
				callback(-1)
			}
		})
	}else{
		callback(-1)
	}
}

async function loginUser(req, res){
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	if (username in usernameReverseLookup){
		var user = getUserByUsername(username)
		var userID = user.userID;
		bcrypt.compare(password, user.password, function(err, correct){
			
			if (correct){
			
				newSession(userID, function(session){
				
					res.cookie("userID", userID, {expires: session.expires, path: '/'});
					res.cookie("username", username, {expires: session.expires, path: '/'})
					res.cookie("token", session.token, {expires: session.expires, path: '/'});
					res.writeHead(200);
					res.end();
					
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
}

async function logoutUser(req, res){
	var userID = res.locals.userID
	
	if (userID == -1){
		// Fail fast
		res.writeHead(401);
		res.end();
	}else if (userID in tokens){
		removeToken(userID)
		
		res.writeHead(200);
		res.end()
	}else{
		res.writeHead(401)
		res.end()
	}
}

async function signupUser(req, res){
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	if (username in usernameReverseLookup || !validUsername(username)){
		res.writeHead(409)
		res.end();
	}else{
		bcrypt.genSalt(12, function(err, salt){
			bcrypt.hash(password, salt, function(err, hash){
			
				newUser(username, hash)
				
				loginUser(req, res)
				
			})
		})
	}
}

module.exports = {
	validateUser: validateUser,
	loginUser: loginUser,
	logoutUser: logoutUser,
	signupUser: signupUser
}