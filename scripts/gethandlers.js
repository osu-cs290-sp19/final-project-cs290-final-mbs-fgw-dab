
var mongo = require('./mongodb')

async function handleGetMany(req, res){
	
	var args = req.query
	args.sorting = req.params.sorting
	
	getMany(args, function(data){
		res.writeHead(200)
		res.write(JSON.stringify(data))
		res.end()
	},
	function(){
		res.writeHead(400)
		res.end()
	})

}

async function handleGetSingle(req, res){
	
	var args = req.query;
	args.type = req.params.type
	
	getSingle(req.params.id, args, function(data){
		res.writeHead(200)
		res.write(JSON.stringify(data))
		res.end()
	},
	function(code){
		res.writeHead(code)
		res.end()
	})
	
}

async function getMany(args, callback, err){
	
	var MAXRETURNEDRECORDS = 200
	
	var limit;
	if (args.limit != undefined){
		limit = Math.min(parseInt(req.query.limit), MAXRETURNEDRECORDS)
	}else{
		limit = 50;
	}
	
	if (limit == 0){
		limit = 50;
	}
	
	var search = {}
	if ('answered' in args){
		if (args.answered == "no"){
			search['answers'] = {$size: 0}
		}else if (args.answered == "yes"){
			search['answers'] = {$not : {$size: 0}}
		}
	}
	
	mongo.getDB().collection('questions').find(search).sort({date: -1}).limit(limit).toArray(function(err, doc){
		if (err){
			err()
		}else{
			if (args.answers == "true"){
				
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
					
					callback(doc)
				})
			}else{
				callback(doc);
			}
		}
	})
}

async function getSingle(id, args, callback, err){
	
	try {
		var convertedID = mongo.makeObjectID(id)
	} catch(e){
		// If we get here, the ID is invalid
		err(400)
		return
	}

	if (args.type == 'q'){
		mongo.getDB().collection('questions').findOne({'_id': convertedID}, function(err, doc){
			if (doc){
				// Check if we want to load answers
				if (args.answers == "true"){
					
					mongo.getDB().collection('answers').find({'_id' : {'$in': doc.answers}}).toArray(function(err, results){
						
						doc.answers = results
						
						callback(doc)
					})
					
				}else{
					callback(doc)
				}
			}else{
				err(404)
			}
		})
	}else if (args.type == 'a'){
		mongo.getDB().collection('answers').findOne({'_id': convertedID}, function(err, doc){
			if (doc){
				callback(doc)
			}else{
				err(404)
			}
		})
	}else{
		err(400)
	}
}

module.exports = {
	handleGetSingle: handleGetSingle,
	handleGetMany: handleGetMany,
	getMany: getMany,
	getSingle: getSingle
}