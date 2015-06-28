/**
 * Default config values
 */
var Store = require('./lib/store');

var mongo_db = process.env.MONGO_DB || 'event_store';
var mongo_collection = 'events';
var mongo_url = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':27017/' + mongo_db;

/**
 *
 * @returns {single.store|*|store|Store|exports.Literal.store|exports.Memory.store}
 */
module.exports.getStore = function() {

    if (!module.exports.store) {
        module.exports.store = new Store(
            mongo_url,
            mongo_collection
        );
    }

    return module.exports.store;
};