var Config = require('./config'),
    logger = require('./logger');

/**
 * Single entry point for handling facts
 *
 * @param sub subscribe object
 * @param pub publish object
 * @param fact object
 */
module.exports.newFact = function(sub, pub, fact) {

    try {
        Config.getStore().add(fact, function(err, result){
            if (!err) {
                logger.info('Added event: ' + fact);
            } else {
                logger.log('error', 'Event adding failed.');
            }
        });
    } catch (e) {
        logger.error("Invalid fact " + JSON.stringify(fact) + " : " + e);
    }
};