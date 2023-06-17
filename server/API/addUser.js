const express = require('express');
const pool = require('./database');

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, email, password, profile_picture } = req.body;

    try {
        // Check if the username or email already exists
        const checkDuplicateQuery = `SELECT * FROM users WHERE username = $1 OR email = $2`;
        const checkDuplicateResult = await pool.query(checkDuplicateQuery, [username, email]);

        if (checkDuplicateResult.rows.length > 0) {
            // User with the same username or email already exists
            return res.status(400).send('Username or email already exists');
        }

        // Insert the new user into the user_information table
        const insertUserQuery = `INSERT INTO users (username, email, password, profile_picture)
                                 VALUES ($1, $2, $3, $4)`;

        console.log(email);
        await pool.query(insertUserQuery, [username, email, password, profile_picture]);

        console.log('User added');
        res.send('User added');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }
});

module.exports = router;
