var logger = require('./lib/logger'),
    rabbitmq = require('rabbit.js'),
    web_router = require('./lib/web_router'),
    fact_router = require('./lib/fact_router');

logger.info('running');

var context = rabbitmq.createContext(
    'amqp://' + process.env.RABBITMQ_PORT_5672_TCP_ADDR + ':' + process.env.RABBITMQ_PORT_5672_TCP_PORT
);

web_router.running();

context.on('ready', function() {

    logger.info('connected');

    web_router.connected();

    logger.info('Running event-store service');

    var sub = context.socket('SUB'),
        pub = context.socket('PUB');

    // get queue name from Config
    var queue = 'events';

    pub.connect(queue, function() {
        sub.connect(queue, function () {
            // route events as they arrive
            sub.on('data', function (body) {
                fact_router.newFact(sub, pub, JSON.parse(body));
            });
        });
    });
});

