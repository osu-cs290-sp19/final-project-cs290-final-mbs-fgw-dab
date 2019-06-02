
var mongo = require('./mongodb')

async function handleNew(req, res){
	var type = req.params.type
	
	console.log(req.body)
	
	if (res.locals.userID == -1 || !('author' in req.body) || req.body.author != res.locals.userID){
		res.writeHead(401)
		res.end()
		
		console.log("New message request but from logged out user")
	}else{
		
		console.log("Request for /new/" + type)
		
		if (type == "question" && validQuestion(req)){
			
			handleQuestion(req, res)
			
		}else if (type == "answer" && validAnswer(req)){
			
			handleAnswer(req, res)
			
		}else{
			
			res.writeHead(400)
			res.end()
		}
	}
}

async function handleQuestion(req, res){
	var body = req.body
	var newQuestion = {}
	
	newQuestion.date = Date.now();
	newQuestion.answers = []
	
	var params = ['title','tags','text','author']
	for (var i = 0; i < params.length; i++){
		newQuestion[params[i]] = body[params[i]]
	}
	
	// Currently, we will just push this data to the database
	mongo.lookupUsername(newQuestion.author, function(uname){
		if (uname){
			newQuestion.username = uname
			mongo.getDB().collection("questions").insertOne(newQuestion, function (err, doc){
				if (err == null){
					res.writeHead(200)
					res.end()
				}else{
					res.writeHead(500)
					res.end()
				}
			})
		}else{
			res.writeHead(400)
			res.end()
		}
	})	
}

async function handleAnswer(req, res){
	var body = req.body
	var newAnswer = {}
	
	newAnswer.date = Date.now()
	
	var params = ['text', 'author', 'parent']
	for (var i = 0; i < params.length; i++){
		newAnswer[params[i]] = body[params[i]]
	}
	
	// Currently, we will just push this data to the database
	
	mongo.getDB().collection("questions").findOne({_id: mongo.makeObjectID(req.body.parent)}, function(err1, doc1){
		if (doc1){
			// Success
			mongo.lookupUsername(newAnswer.author, function(uname){
				if (uname){
					
					newAnswer.username = uname
					
					mongo.getDB().collection("answers").insertOne(newAnswer, function (err2, doc2){
						if (err2 == null){
							
							mongo.getDB().collection("questions").updateOne({
							_id: mongo.makeObjectID(req.body.parent)},
							{
								$push: {'answers': doc2.ops[0]._id}
							},
							function(err3, doc3){
								
								if (err3 != null){
									// Something is wrong with the server
									res.writeHead(500)
									res.end()
								}else{
									res.writeHead(200)
									res.end()
								}
							})
								
						}else{
							// Something is wrong with the server
							res.writeHead(500)
							res.end()
						}
					})
				}else{
					res.writeHead(400)
					res.end()
				}
			})
		}else{
			// Failure
			res.writeHead(400)
			res.end()
			
		}
	})
	
}

function validQuestion(req){
	var body = req.body
	
	var params = [
	
	{name: 'title', type: 'string'},
	{name: 'tags', type: 'array'},
	{name: 'author', type: 'string'},
	{name: 'text', type: 'string'}
	
	]
	
	for (var i = 0; i < params.length; i++){
		var param = params[i]
		
		if (! param.name in body){
			console.log("Parameter missing in request")
			return false
		}else if (customTypeOf(req.body[param.name]) != param.type){
			console.log("Parameter incorrect type in request")
			return false
		}
	}
	
	return true
}

function validAnswer(req){
	var body = req.body
	
	var params = [
	
	{name: 'author', type: 'string'},
	{name: 'text', type: 'string'},
	{name: 'parent', type: 'string'}
	
	]
	
	for (var i = 0; i < params.length; i++){
		var param = params[i]
		
		if (! param.name in body){
			console.log("Parameter missing in request")
			return false
		}else if (customTypeOf(req.body[param.name]) != param.type){
			console.log("Parameter incorrect type in request")
			return false
		}
	}
	
	return true
}

function customTypeOf(object){
	if (object == undefined){
		return "undefined"
	}else if (Array.isArray(object)){
		return "array"
	}else{
		return typeof object;
	}
}

async function handleGet(req, res){
	var id = req.params.id
	
	if (id == "all"){
		mongo.getDB().collection('questions').find({}).toArray(function(err, doc){
			if (err){
				res.writeHead(500)
				res.end()
			}else{
				console.log(doc)
				res.writeHead(200)
				res.write(JSON.stringify(doc))
				res.end();
			}
		})
	}else{
		
		try {
			var convertedID = mongo.makeObjectID(id)
		} catch(e){
			// If we get here, the ID is invalid
			res.writeHead(400)
			res.end()
			return
		}

		if (req.params.type == 'q'){
			mongo.getDB().collection('questions').findOne({'_id': convertedID}, function(err, doc){
				if (doc){
					res.writeHead(200)
					res.write(JSON.stringify(doc))
					res.end()
				}else{
					res.writeHead(404)
					res.end()
				}
			})
		}else if (req.params.type == 'a'){
			mongo.getDB().collection('answers').findOne({'_id': convertedID}, function(err, doc){
				if (doc){
					res.writeHead(200)
					res.write(JSON.stringify(doc))
					res.end()
				}else{
					res.writeHead(404)
					res.end()
				}
			})
		}else{
			res.writeHead(400)
			res.end()
		}
	
	}
}

module.exports = {
	handleNew: handleNew,
	handleGet: handleGet
}
