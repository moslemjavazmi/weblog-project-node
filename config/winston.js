const winston = require('winston');
const appRoot = require('app-root-path');

const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        format:winston.format.json(),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format:winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
        
    }
}

const logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
})

logger.stream = {
    write: function(message){ 
        logger.info(message);
    },
};

module.exports = logger;