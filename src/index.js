var logger = require('./lib/logger'),
    rabbitmq = require('rabbit.js');

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

            logger.info(body);

            var event = JSON.parse(body);

        });
    });
});
