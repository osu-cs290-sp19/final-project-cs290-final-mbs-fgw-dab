
// Takes a username and a password, then logs the user in
// (creates valid user authentication token)
// Args: username, password, callback, err
// Returns: calls callback(userID) or calls err() if login fails
async function loginUser(username, password, callback, err){
	console.log("Processing login request")
	$.ajax({
		type: "POST",
		url: "/login",
		headers: {
			"Authorization": "Basic " + btoa(username + ":" + password)
		},
		success: function(){
			
			callback();
			
		},
		error: function(xhr, error){
			err()
		}
		
		
	})
}

// Logs out the user who is registered in the cookies
// and logs the user out. This invalidates their login token
// Args: callback
// Returns: calls callback() with no argument
async function logoutUser(callback){
	console.log("Processing logout request")
	
	var req = $.ajax({
		
		type: "POST",
		url: "/logout"
		
	})
	
	req.always(function(){
		Cookies.remove('username')
		Cookies.remove('userID')
		Cookies.remove('token')
		
		callback()
	})
}

// Takes a username and password, then creates an account
// using those credentials, in addition to logging them in
// Args: username, password, callback, err
// Returns: calls callback(userID) or calls err() if signup fails
async function signupUser(username, password, callback, err){
	console.log("Processing signup request")
	
	$.ajax({
		type: "POST",
		url: "/signup",
		headers: {
			"Authorization": "Basic " + btoa(username + ":" + password)
		},
		success: function(){
			
			callback();
			
		},
		error: function(xhr, error){
			err();
		}
		
	})
}

function getUsername(){
	return Cookies.get("username")
}

function getUserID(){
	return Cookies.get("userID")
}

function isUserLoggedIn(){
	return Cookies.get("userID") != undefined;
}