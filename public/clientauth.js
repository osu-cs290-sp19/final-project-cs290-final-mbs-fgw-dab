
// Takes a username and a password, then logs the user in
// (creates valid user authentication token)
// Args: username, password, callback
// Returns: calls callback with (userID) or (undefined)
// if login fails
function loginUser(username, password, callback){
	$.ajax({
		type: "GET",
		url: "/login",
		headers: {
			"Authorization": "Basic " + btoa(username + ":" + password)
		}
		success: function(){
			
			callback();
			
		}
		
	})
}

// Takes a userID and logs the user out
// This invalidates there login token
// Args: userID, callback
// Returns: calls callback() with no argument
function logoutUser(userID, callback){
	
	callback();
}

// Takes a username and password, then creates an account
// using those credentials, in addition to logging them in
// Args: username, password
// Returns: calls callback with (userID) or (undefined) if 
// signup fails
function signupUser(username, password){
	
	callback();
}