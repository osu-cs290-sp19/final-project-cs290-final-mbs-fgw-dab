
var crypto = require('crypto')
var bcrypt = require('bcrypt')

var tokens = {}
var users = {}
var usernameReverseLookup = {}
var currID = 1;

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
	
}

function getToken(userID){
	return tokens[userID]
}

// Takes a 

async function newSession(userID, callback){
	// Generate a new session for this user
	var token = new Buffer(crypto.randomBytes(32)).toString('base64');
	
	var startDate = new Date();
	
	var endDate = new Date();
	endDate.setHours(endDate.getHours() + 1); // 1 hour expiry
	
	bcrypt.genSalt(12, function(err, salt){
		bcrypt.hash(token, salt, function(err, hash){
			
			console.log(err)
			
			var clientToken = token
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
					console.log("Auth Token Expired")
					removeToken(userID)
					
					callback(-1)
				}
				
				// If the token is good and the date is good, we are good
				console.log("Auth Data Good")
				callback(userID)
				
			}else{
				console.log("Auth Token Incorrect")
				callback(-1)
			}
		})
	}else{
		
		console.log("Auth Data Missing")

		callback(-1)
	}
}

async function loginUser(req, res){
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	// TEMP FOR TESTING
	
	if (username in usernameReverseLookup){
		var user = getUserByUsername(username)
		var userID = user.userID;
		bcrypt.compare(password, user.password, function(err, correct){
			
			if (correct){
			
				newSession(userID, function(token){
				
					res.cookie("userID", userID);
					res.cookie("token", token);
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
	console.log("Processing logout request")
	
	console.log(users)
	console.log(tokens)
	
	var userID = res.locals.userID
	
	if (userID in tokens){
		removeToken(userID)
	}
}

async function signupUser(req, res){
	console.log("Processing signup request")
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	bcrypt.genSalt(12, function(err, salt){
		bcrypt.hash(password, salt, function(err, hash){
		
			newUser(username, hash)
			
		})
	})
}

module.exports = {
	validateUser: validateUser,
	loginUser: loginUser,
	logoutUser: logoutUser,
	signupUser: signupUser
}