
// Takes a username and a password, then logs the user in
// (creates valid user authentication token)
// Args: username, password, callback
// Returns: calls callback with (userID) or (undefined)
// if login fails
function loginUser(username, password, callback){
	console.log("Processing login request")
	$.ajax({
		type: "GET",
		url: "/login",
		headers: {
			"Authorization": "Basic " + btoa(username + ":" + password)
		},
		success: function(){
			
			callback();
			
		}
		
	})
}

// Logs out the user who is registered in the cookies
// and logs the user out. This invalidates their login token
// Args: callback
// Returns: calls callback() with no argument
function logoutUser(callback){
	console.log("Processing logout request")
	callback();
}

// Takes a username and password, then creates an account
// using those credentials, in addition to logging them in
// Args: username, password
// Returns: calls callback with (userID) or (undefined) if 
// signup fails
function signupUser(username, password){
	console.log("Processing signup request")
	callback();
}