
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

module.exports = {
	preDatabase: prepDatabase,
	getDB: getDB,
	makeObjectID: makeObjectID
}