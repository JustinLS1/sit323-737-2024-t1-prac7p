const { MongoClient } = require('mongodb');
require('dotenv').config();
const winston = require('winston');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Logger setup
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

const mongoDb = process.env.MONGO_DB;
const mongoUri = process.env.MONGO_URI;
let db;

async function connectMongo() {
    let client;
    try {
        client = new MongoClient(mongoUri);
        await client.connect();
        db = client.db(mongoDb);
        logger.info("✅ Connected to MongoDB");

        const port = 3001;
        app.listen(port, () => {
            console.log(`Microservice running at http://localhost:${port}`);
        });
    } catch (err) {
        logger.error("Failed to connect to MongoDB: " + err.message);
        process.exit(1);
    }
}

connectMongo();

// Endpoint for add
app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    const operation = 'addition';
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for addition');
        return res.status(400).json({ error: 'Invalid input. Please provide numbers.' });
    }
    const result = parseFloat(num1) + parseFloat(num2);
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
    });
    res.json({ result });
});

// Endpoint for subtraction
app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query;
    const operation = 'subtraction';
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for subtraction');
        return res.status(400).json({ error: 'Invalid input. Please provide numbers.' });
    }
    const result = parseFloat(num1) - parseFloat(num2);
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
    });
    res.json({ result });
});

// Endpoint for multiplication
app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query;
    const operation = 'multiplication';
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for multiplication');
        return res.status(400).json({ error: 'Invalid input. Please provide numbers.' });
    }
    const result = parseFloat(num1) * parseFloat(num2);
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
    });
    res.json({ result });
});

// Endpoint for division
app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;
    const operation = 'division';
    if (isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input for division');
        return res.status(400).json({ error: 'Invalid input. Please provide numbers.' });
    }
    if (parseFloat(num2) === 0) {
        logger.error('Division by zero attempted');
        return res.status(400).json({ error: 'Cannot divide by zero.' });
    }
    const result = parseFloat(num1) / parseFloat(num2);
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: ${num1} ${operation} ${num2}`,
    });
    res.json({ result });
});

// Endpoint for exponentiation
app.get('/exponentiate', (req, res) => {
    const { base, exponent } = req.query;
    const operation = 'exponentiation';
    if (isNaN(base) || isNaN(exponent)) {
        logger.error('Invalid input for exponentiation');
        return res.status(400).json({ error: 'Invalid input. Please provide numbers.' });
    }
    const result = parseFloat(base) ** parseFloat(exponent);
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: ${base} ${operation} ${exponent}`,
    });
    res.json({ result });
});

// Endpoint for square root
app.get('/squareroot', (req, res) => {
    const { num } = req.query;
    const operation = 'square root';
    if (isNaN(num) || parseFloat(num) < 0) {
        logger.error('Invalid input for square root');
        return res.status(400).json({ error: 'Invalid input. Please provide a non-negative number.' });
    }
    const result = Math.sqrt(parseFloat(num));
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: ${operation} of ${num}`,
    });
    res.json({ result });
});

// Endpoint for modulo
app.get('/modulo', (req, res) => {
    const { dividend, divisor } = req.query;
    const operation = 'modulo';
    if (isNaN(dividend) || isNaN(divisor)) {
        logger.error('Invalid input for modulo');
        return res.status(400).json({ error: 'Invalid input. Please provide numbers.' });
    }
    const result = parseFloat(dividend) % parseFloat(divisor);
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: ${dividend} ${operation} ${divisor}`,
    });
    res.json({ result });
});

// Endpoint for increment
app.get('/increment', (req, res) => {
    const { num } = req.query;
    const operation = 'increment';
    if (isNaN(num)) {
        logger.error('Invalid input for increment');
        return res.status(400).json({ error: 'Invalid input. Please provide a number.' });
    }
    const result = parseFloat(num) + 1;
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: incrementing ${num}`,
    });
    res.json({ result });
});

// Endpoint for decrement
app.get('/decrement', (req, res) => {
    const { num } = req.query;
    const operation = 'decrement';
    if (isNaN(num)) {
        logger.error('Invalid input for increment');
        return res.status(400).json({ error: 'Invalid input. Please provide a number.' });
    }
    const result = parseFloat(num) - 1;
    logger.log({
        level: 'info',
        message: `New ${operation} operation requested: decrementing ${num}`,
    });
    res.json({ result });
});

// CRUD Operations for Users (SIT737 9.1p)

// Endpoint for creating users
app.post('/addUser', async (req, res) => {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
        logger.error('Missing required fields for addUser');
        return res.status(400).json({ error: 'Name, email, and age are required.' });
    }

    try {
        const result = await db.collection('users').insertOne({ name, email, age });
        logger.info(`User created: ${name}`);
        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (err) {
        logger.error('Failed to add user: ' + err.message);
        res.status(500).json({ error: 'Failed to add user.' });
    }
});

// Endpoint for reading users
app.get('/getUser/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const user = await db.collection('users').findOne({ name });
        if (!user) {
            logger.error(`User not found: ${name}`);
            return res.status(404).json({ error: 'User not found.' });
        }

        logger.info(`User retrieved: ${name}`);
        res.json(user);
    } catch (err) {
        logger.error('Failed to retrieve user: ' + err.message);
        res.status(500).json({ error: 'Failed to retrieve user.' });
    }
});

// Endpoint for updating users
app.put('/updateUser/:name', async (req, res) => {
    const { name } = req.params;
    const { email, age } = req.body;

    if (!email && !age) {
        logger.error('No valid fields to update');
        return res.status(400).json({ error: 'At least one field (email or age) is required to update.' });
    }

    try {
        const result = await db.collection('users').updateOne(
            { name },
            { $set: { email, age } }
        );

        if (result.matchedCount === 0) {
            logger.error(`User not found for update: ${name}`);
            return res.status(404).json({ error: 'User not found.' });
        }

        logger.info(`User updated: ${name}`);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        logger.error('Failed to update user: ' + err.message);
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

// Endpoint for deleting users
app.delete('/deleteUser/:name', async (req, res) => {
    const { name } = req.params;

    try {
        const result = await db.collection('users').deleteOne({ name });

        if (result.deletedCount === 0) {
            logger.error(`User not found for deletion: ${name}`);
            return res.status(404).json({ error: 'User not found.' });
        }

        logger.info(`User deleted: ${name}`);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        logger.error('Failed to delete user: ' + err.message);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});