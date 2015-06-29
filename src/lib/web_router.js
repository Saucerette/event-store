var app = require('express')(),
    bodyParser = require('body-parser'),
    event_routes = require('./event_routes');

/**
 * Hook to set up routing of web requests
 */
module.exports.running = function() {

    app.use(bodyParser.json({limit: '1024kb'}));

    app.use('/', event_routes);
};

/**
 * Hook to start listening to web requests
 */
module.exports.connected = function() {

    var PORT = process.env.PORT || 80;

    app.listen(PORT);
};