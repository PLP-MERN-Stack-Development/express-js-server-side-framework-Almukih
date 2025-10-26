// errors/errors.js
class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 500;
        this.name = this.constructor.name;
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation Error') {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

module.exports = { AppError, NotFoundError, ValidationError, UnauthorizedError };
