// middleware/validate.js
const { ValidationError } = require('../errors/errors');

function validateProduct(req, res, next) {
    const { name, description, price, category, inStock } = req.body;
    const errors = [];

    if (!name || typeof name !== 'string') errors.push('Name is required and must be a string');
    if (!description || typeof description !== 'string') errors.push('Description is required and must be a string');
    if (typeof price !== 'number') errors.push('Price must be a number');
    if (!category || typeof category !== 'string') errors.push('Category is required and must be a string');
    if (typeof inStock !== 'boolean') errors.push('inStock must be a boolean');

    if (errors.length) return next(new ValidationError(errors.join('; ')));
    next();
}

function validateProductForUpdate(req, res, next) {
    const { name, description, price, category, inStock } = req.body;
    const errors = [];
    if (name && typeof name !== 'string') errors.push('Name must be a string');
    if (description && typeof description !== 'string') errors.push('Description must be a string');
    if (price && typeof price !== 'number') errors.push('Price must be a number');
    if (category && typeof category !== 'string') errors.push('Category must be a string');
    if (inStock !== undefined && typeof inStock !== 'boolean') errors.push('inStock must be a boolean');

    if (errors.length) return next(new ValidationError(errors.join('; ')));
    next();
}

module.exports = { validateProduct, validateProductForUpdate };
