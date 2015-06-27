var express = require('express'),
    logger = require('./lib/logger'),
    rabbitmq = require('rabbit.js'),
    MongoClient = require('mongodb').MongoClient;

logger.info('running');

var context = rabbitmq.createContext(
    'amqp://' + process.env.RABBITMQ_PORT_5672_TCP_ADDR + ':' + process.env.RABBITMQ_PORT_5672_TCP_PORT
);

var mongo_url = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':27017/store';
var collection = '';

MongoClient.connect(mongo_url, function(err, db) {
    if (!err) {
        logger.log('info', 'Connected to server at ' + mongo_url);
        collection = db.collection('events');
    } else {
        logger.log('error', 'Connection to mongo failed');
        // shutdown here
    }
});

context.on('ready', function() {
    logger.info('connected');

    // subscribe to 'events' queue
    var sub = context.socket('SUB');

    sub.connect('events', function(){

        // deal with events as they come in
        sub.on('data', function (body) {

            var event = JSON.parse(body);

            logger.info(event);

            collection.insert(event, function (err, result) {
                if (!err) {
                    logger.log('info', 'Inserted event.');
                } else {
                    logger.log('error', 'Event insert failed.');
                }
            });
        });
    });
});

var routes = express.Router();

routes.get('/', function (req, res) {
    res.json({
        name : 'event-store',
        description : "Stores events"
    });
});

routes.get('/events', function (req, res) {
    // expect query to contain id=abc
    var events = collection.find({"data.id" : req.query.id}, function(err, results){

        res.set({'Content-Type' : "application/json"});

        if (!err){
            res.status(200).send(results);
        } else {
            res.status(500).send({"error" : err});
        }
    });


});