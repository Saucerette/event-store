var express = require('express'),
    logger = require('./lib/logger');

module.exports = (function() {
    'use strict';

    var routes = express.Router();

    /**
     * Obtain all events by id
     */
    routes.get('/events', function (req, res) {

        // expect query to contain id=abc
        collection.find({"data.id" : req.query.id}, {}, {sort:"timestamp"}).toArray(function(err, results){

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
