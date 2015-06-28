var express = require('express'),
    logger = require('./lib/logger'),
    Config = require('./config');

module.exports = (function() {
    'use strict';

    var routes = express.Router();

    /**
     * Obtain all events by id
     */
    routes.get('/events', function (req, res) {

        Config.getStore().find(req.query.id, function(err, results) {

            if (!err){
                logger.info(JSON.stringify(results));
                res.status(200).json(results);
            } else {
                logger.error(err);
                res.status(500).json({"error" : err});
            }
        });
    });

    return routes;

})();
