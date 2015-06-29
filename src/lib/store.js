var MongoClient = require('mongodb').MongoClient,
    logger = require('./logger');

/*
 * Provides access to documents
 */
function Store(url, collection) {
    this.url = url;
    this.collection_name = collection;
    this.collection = null;
}

module.exports = Store;

/**
 * Retrieve all events objects with data.id == id parameter
 *
 * @param id
 * @param callback
 */
Store.prototype.find = function(id, callback) {

    this.exec(function(err, db, collection) {
        if (!err) {
            collection.find({"data.id": id}, {}, {sort: "timestamp"}).toArray(function (err, results) {

                db.close();
                callback(err, results);
            });
        } else {
            callback(err, null);
        }
    });
};

/**
 *
 * @param event
 * @param callback
 */
Store.prototype.add = function(event, callback) {

    this.exec(function(err, db, collection) {

        if (!err) {
            collection.insert(event, function (err, result) {
                db.close();
                callback(err, result);
            });
        } else {
            callback(err, null);
        }
    });
};



/**
 * I don't see why this store connects to mongo for each operation
 */
Store.prototype.exec = function(func) {
    var store = this;

    MongoClient.connect(this.url, function(err, db) {
        if (!err) {
            logger.log('info', 'Connected to server at ' + store.url);
            func(null, db, db.collection(store.collection_name));
        } else {
            logger.log('error', 'Connect to server failed at ' + store.url);
            func(err, null, null);
        }
    });
};