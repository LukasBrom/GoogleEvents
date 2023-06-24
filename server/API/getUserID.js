const express = require('express');
const pool = require('./database');

const router = express.Router();

router.post('/', (req, res) => {
    const { email, username, password } = req.body;

    let getUserQuery = 'SELECT user_id FROM users WHERE ';
    const values = [];

    if (email && password) {
        getUserQuery += 'email = $1 AND password = $2';
        values.push(email, password);
    } else if (username && password) {
        getUserQuery += 'username = $1 AND password = $2';
        values.push(username, password);
    } else {
        return res.status(400).send('Invalid request');
    }

    pool
        .query(getUserQuery, values)
        .then((result) => {
            const user = result.rows[0];
            if (!user) {
                return res.status(404).send('Invalid email or password');
            }
            const { user_id } = user;
            res.send(user_id);
        })
        .catch((error) => {
            console.error('Error retrieving user ID:', error);
            res.status(500).send('Error retrieving user ID');
        });
});

module.exports = router;
