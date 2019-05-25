
// Takes a 

function validateUser(req, callback){
	callback(-1)
}

function loginUser(req, res){
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	
}

function logoutUser(req, res){
	console.log("Processing logout request")
}

function registerUser(req, res){
	console.log("Processing request request")
	var uncoded = new Buffer(req.headers.authorization.split(' ')[1], 'base64').toString('ascii')
	var username = uncoded.split(':')[0]
	var password = uncoded.split(':')[1]
	
	
}

module.exports = {
	validateUser: validateUser,
	loginUser: loginUser,
	logoutUser: logoutUser,
	registerUser: registerUser
}