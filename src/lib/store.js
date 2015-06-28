var MongoClient = require('mongodb').MongoClient;

/*
 * Provides access to documents
 */
function Store(url, collection) {

    MongoClient.connect(url, function(err, db) {
        if (!err) {
            logger.info('Connected to server at ' + url);
            this.collection = db.collection(collection);
        } else {
            logger.error('Connection to mongo failed');
            throw "Can't connect to mongo " + url
        }
    });
};

module.exports = Store;

/**
 * Retrieve all events objects with data.id == id parameter
 *
 * @param id
 * @param callback
 */
Store.prototype.find = function(id, callback) {

    this.collection.find({"data.id" : id}, {}, {sort:"timestamp"}).toArray(function(err, results){

        if (!err){
            callback(null, results);
        } else {
            callback(err, null);
        }
    });
};

/**
 * Add a new event object
 *
 * @param id
 * @param doc
 * @param callback
 */
Store.prototype.add = function(event, callback) {

    this.collection.insert(event, function (err, result) {

        if (!err){
            callback(null, result);
        } else {
            callback(err, null);
        }
    });
};
