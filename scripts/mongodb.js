
var mongo = require('mongodb')

var db;

function prepDatabase(url, database, callback){
	mongo.MongoClient.connect(url, function(err, newDB){
		db = newDB.db(database);
		
		callback()
	})
}

function getDB(){ return db; }

function makeObjectID(string){
	return mongo.ObjectID(string)
}

async function lookupUsername(userID, callback){
	getDB().collection('users').findOne({_id: makeObjectID(userID)}, function(err, doc){
		if (doc){
			callback(doc.username)
		}else{
			callback(undefined)
		}
	})
}

module.exports = {
	preDatabase: prepDatabase,
	getDB: getDB,
	makeObjectID: makeObjectID,
	lookupUsername: lookupUsername
}