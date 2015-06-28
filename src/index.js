var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('./lib/logger'),
    rabbitmq = require('rabbit.js'),
    MongoClient = require('mongodb').MongoClient,
    routes = require('./routes');

logger.info('running');

var context = rabbitmq.createContext(
    'amqp://' + process.env.RABBITMQ_PORT_5672_TCP_ADDR + ':' + process.env.RABBITMQ_PORT_5672_TCP_PORT
);

var mongo_url = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':27017/store';
var collection = '';

MongoClient.connect(mongo_url, function(err, db) {
    if (!err) {
        logger.info('Connected to server at ' + mongo_url);
        collection = db.collection('events');
    } else {
        logger.error('Connection to mongo failed');
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

            try {
                var event = JSON.parse(body);

                logger.info(event);

                collection.insert(event, function (err, result) {
                    if (!err) {
                        logger.log('info', 'Inserted event.');
                    } else {
                        logger.log('error', 'Event insert failed.');
                    }
                });
            } catch (e) {
                logger.error(e);
            }

        });
    });
});

var PORT = process.env.PORT || 80;
var app = express();

app.use(bodyParser.json({limit: '1024kb'}));
app.use('/', routes);
app.listen(PORT);

logger.info('Running event-store service on http://localhost:' + PORT);