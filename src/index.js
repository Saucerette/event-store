var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('./lib/logger'),
    rabbitmq = require('rabbit.js'),
    Config = require('./config'),
    routes = require('./routes');

logger.info('running');

var context = rabbitmq.createContext(
    'amqp://' + process.env.RABBITMQ_PORT_5672_TCP_ADDR + ':' + process.env.RABBITMQ_PORT_5672_TCP_PORT
);

context.on('ready', function() {
    
    logger.info('connected');

    // subscribe to 'events' queue
    var sub = context.socket('SUB');

    sub.connect('events', function(){

        // deal with events as they come in
        sub.on('data', function (body) {

            try {
                Config.getStore().add(JSON.parse(body), function(err, result){
                    if (!err) {
                        logger.info('Added event: ' + JSON.parse(body));
                    } else {
                        logger.log('error', 'Event adding failed.');
                    }
                });
            } catch (e) {
                logger.error("Invalid event body " + body + " : " + e);
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