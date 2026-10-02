require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// GET all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses
            ORDER BY id;
        `);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// GET one expense by ID
app.get('/api/expenses/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    try {
        const result = await pool.query(`
            SELECT
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date
            FROM expenses
            WHERE id = $1;
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Expense not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// POST create new expense
app.post('/api/expenses', async (req, res) => {
    const { title, amount, category, date } = req.body;

    // Validation
    if (
        typeof title !== 'string' ||
        title.trim() === '' ||
        amount === undefined ||
        Number(amount) <= 0 ||
        !['Food', 'Transport', 'Bills', 'Entertainment', 'Other'].includes(category) ||
        !date
    ) {
        return res.status(400).json({
            message: 'Invalid expense data'
        });
    }

    try {
        const result = await pool.query(`
            INSERT INTO expenses (title, amount, category, date)
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date;
        `, [
            title.trim(),
            Number(amount),
            category,
            date
        ]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// PUT update expense
app.put('/api/expenses/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { title, amount, category, date } = req.body;

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    // Validate data
    if (
        typeof title !== 'string' ||
        title.trim() === '' ||
        amount === undefined ||
        Number(amount) <= 0 ||
        !['Food', 'Transport', 'Bills', 'Entertainment', 'Other'].includes(category) ||
        !date
    ) {
        return res.status(400).json({
            message: 'Invalid expense data'
        });
    }

    try {
        const result = await pool.query(`
            UPDATE expenses
            SET
                title = $1,
                amount = $2,
                category = $3,
                date = $4
            WHERE id = $5
            RETURNING
                id,
                title,
                amount::float8 AS amount,
                category,
                to_char(date, 'YYYY-MM-DD') AS date;
        `, [
            title.trim(),
            Number(amount),
            category,
            date,
            id
        ]);

        // Expense not found
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Expense not found'
            });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// DELETE expense
app.delete('/api/expenses/:id', async (req, res) => {
    const id = Number(req.params.id);

    // Validate ID
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'Invalid ID'
        });
    }

    try {
        const result = await pool.query(`
            DELETE FROM expenses
            WHERE id = $1
            RETURNING id;
        `, [id]);

        // Expense not found
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            message: 'Expense deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});