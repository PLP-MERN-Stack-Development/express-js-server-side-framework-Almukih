// middleware/auth.js
const { UnauthorizedError } = require('../errors/errors');

module.exports = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    const expectedKey = process.env.API_KEY || 'test-api-key';

    if (!apiKey || apiKey !== expectedKey) {
        return next(new UnauthorizedError('Invalid or missing API key'));
    }
    next();
};
