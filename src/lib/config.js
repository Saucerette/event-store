var rabbitmq = require('rabbit.js');

var Store = require('./store');

var mongo_collection = 'events';
var mongo_url = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT +'/store';
var queue_url = 'amqp://' + process.env.RABBITMQ_PORT_5672_TCP_ADDR + ':' + process.env.RABBITMQ_PORT_5672_TCP_PORT;

/**
 * @returns {single.store|*|store|Store|exports.Literal.store|exports.Memory.store}
 */
module.exports.getStore = function() {

    'use strict';

    if (!module.exports.store) {
        module.exports.store = new Store(
            mongo_url,
            mongo_collection
        );
    }

    return module.exports.store;
};

/**
 * @returns {*}
 */
module.exports.getQueueContext = function() {

    'use strict';

    if (!module.exports.queue_context){
        module.exports.queue_context = rabbitmq.createContext(queue_url);
    }

    return module.exports.queue_context;
};