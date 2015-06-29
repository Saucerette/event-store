var logger = require('./lib/logger'),
    web_router = require('./lib/web_router'),
    fact_router = require('./lib/fact_router'),
    Config = require('./lib/config');

logger.info('running');

var context = Config.getQueueContext();

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
            // route facts as they arrive
            sub.on('data', function (body) {
                fact_router.newFact(sub, pub, JSON.parse(body));
            });
        });
    });
});

