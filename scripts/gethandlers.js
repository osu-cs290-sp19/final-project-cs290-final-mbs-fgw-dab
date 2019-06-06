
var mongo = require('./mongodb')

async function handleGetMany(req, res){
	
	var MAXRETURNEDRECORDS = 200
	
	var sorting = req.params.sorting
	
	var limit;
	if (req.query.limit != undefined){
		limit = Math.min(parseInt(req.query.limit), MAXRETURNEDRECORDS)
	}else{
		limit = 50;
	}
	
	if (limit == 0){
		limit = 50;
	}
	
	// Build up the search query
	var search = {}
	if ('answered' in req.query){
		if (req.query.answered == "no"){
			search['answers'] = {$size: 0}
		}else if (req.query.answered == "yes"){
			search['answers'] = {$not : {$size: 0}}
		}
	}
	
	mongo.getDB().collection('questions').find(search).sort({date: -1}).limit(limit).toArray(function(err, doc){
		if (err){
			res.writeHead(500)
			res.end()
		}else{
			if (req.query.answers == "true"){
				
				var allAnswerIDs = [];
				for (var i = 0; i < doc.length; i++){
					allAnswerIDs.push(...doc[i].answers)
				}
				
				mongo.getDB().collection('answers').find({'_id' : {'$in': allAnswerIDs}}).toArray(function(err, results){
					var answers = {}
					for (var i = 0; i < results.length; i++){
						if (!answers[results[i].parent]){
							answers[results[i].parent] = []
						}
						answers[results[i].parent].push(results[i])
						
					}
					
					for (var i = 0; i < doc.length; i++){
						doc[i].answers = answers[doc[i]._id] ? answers[doc[i]._id] : [];
					}
					
					res.writeHead(200)
					res.write(JSON.stringify(doc))
					res.end();
				})
			}else{
				res.writeHead(200)
				res.write(JSON.stringify(doc))
				res.end();
			}
		}
	})
}

async function handleGetSingle(req, res){
	
	var id = req.params.id
	
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
				// Check if we want to load answers
				if (req.query.answers == "true"){
					
					mongo.getDB().collection('answers').find({'_id' : {'$in': doc.answers}}).toArray(function(err, results){
						
						doc.answers = results
						
						res.writeHead(200)
						res.write(JSON.stringify(doc))
						res.end()
					})
					
				}else{
					res.writeHead(200)
					res.write(JSON.stringify(doc))
					res.end()
				}
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

module.exports = {
	handleGetSingle: handleGetSingle,
	handleGetMany: handleGetMany
}