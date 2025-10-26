// routes/products.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { validateProduct, validateProductForUpdate } = require('../middleware/validate');
const { NotFoundError } = require('../errors/errors');

const router = express.Router();

// In-memory database
let products = [
    {
        id: '1',
        name: 'Laptop',
        description: 'High-performance laptop with 16GB RAM',
        price: 1200,
        category: 'electronics',
        inStock: true,
    },
    {
        id: '2',
        name: 'Smartphone',
        description: 'Latest model with 128GB storage',
        price: 800,
        category: 'electronics',
        inStock: true,
    },
    {
        id: '3',
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with timer',
        price: 50,
        category: 'kitchen',
        inStock: false,
    },
];

// GET /api/products — list all products (with filtering, pagination, search)
router.get('/', (req, res) => {
    let result = [...products];

    const { category, q, page = 1, limit = 10 } = req.query;

    if (category) {
        result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (q) {
        const keyword = q.toLowerCase();
        result = result.filter((p) => p.name.toLowerCase().includes(keyword));
    }

    const start = (page - 1) * limit;
    const end = start + parseInt(limit);

    const paginated = result.slice(start, end);

    res.json({
        total: result.length,
        page: parseInt(page),
        limit: parseInt(limit),
        data: paginated,
    });
});

// GET /api/products/:id
router.get('/:id', (req, res, next) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return next(new NotFoundError('Product not found'));
    res.json(product);
});

// POST /api/products
router.post('/', validateProduct, (req, res) => {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
        id: uuidv4(),
        name,
        description,
        price,
        category,
        inStock,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put('/:id', validateProductForUpdate, (req, res, next) => {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

// DELETE /api/products/:id
router.delete('/:id', (req, res, next) => {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    const deleted = products.splice(index, 1)[0];
    res.json({ message: 'Product deleted successfully', deleted });
});

// GET /api/products/stats — count by category
router.get('/stats/all', (req, res) => {
    const stats = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    res.json({ total: products.length, byCategory: stats });
});

module.exports = router;
