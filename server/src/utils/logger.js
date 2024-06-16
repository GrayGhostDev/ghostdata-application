const { createLogger, transports, format } = require('winston');

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json()
);

// Define development log format
const devLogFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  })
);

const logger = createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: process.env.NODE_ENV === 'development' ? devLogFormat : logFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log', level: 'info' }),
    new transports.File({ filename: 'errors.log', level: 'error' })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'rejections.log' })
  ]
});

// For uncaught exceptions and unhandled rejections in development, also log to console
if (process.env.NODE_ENV === 'development') {
  logger.exceptions.handle(
    new transports.Console({ format: devLogFormat })
  );
  logger.rejections.handle(
    new transports.Console({ format: devLogFormat })
  );
}

module.exports = logger;
