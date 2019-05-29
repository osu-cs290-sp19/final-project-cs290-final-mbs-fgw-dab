
// Takes a username and a password, then logs the user in
// (creates valid user authentication token)
// Args: username, password, callback
// Returns: calls callback with (userID) or (undefined)
// if login fails
async function loginUser(username, password, callback, err){
	console.log("Processing login request")
	$.ajax({
		type: "GET",
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
	
	$.ajax({
		type: "GET",
		url: "/logout",
		success: function(){
			
			Cookies.remove('username')
			Cookies.remove('userID')
			Cookies.remove('token')
			
			callback();
			
		},
		err: function(){
			
			// Not sure what to do here
			// I don't think there needs to be a separate error handler
			// for logging out
			// So for now I just call callback()
			callback()
		}
		
	})
}

// Takes a username and password, then creates an account
// using those credentials, in addition to logging them in
// Args: username, password
// Returns: calls callback with (userID) or (undefined) if 
// signup fails
async function signupUser(username, password, callback, err){
	console.log("Processing signup request")
	
	$.ajax({
		type: "GET",
		url: "/signup",
		headers: {
			"Authorization": "Basic " + btoa(username + ":" + password)
		},
		success: function(){
			
			callback();
			
		},
		error: function(xhr, error){
			console.log(xhr)
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