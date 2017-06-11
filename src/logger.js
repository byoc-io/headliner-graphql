import winston from 'winston';
import config from './config';

const level = config.logging.stdout.level || 'debug';

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: level,
      timestamp: () => {
        return (new Date()).toISOString();
      }
    })
  ]
});

export default logger;
