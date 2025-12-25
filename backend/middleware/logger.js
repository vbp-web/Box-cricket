import morgan from 'morgan';
import { logger } from '../utils/logger.js';

// Create a stream object for Morgan to write to Winston
const stream = {
    write: (message) => logger.http(message.trim()),
};

// Skip logging during tests
const skip = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'test';
};

// Build the Morgan middleware
const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream, skip }
);

export default morganMiddleware;
