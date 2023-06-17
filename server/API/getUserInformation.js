const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', (req, res) => {
    const user_id = "'" + req.body.user_id + "'";

    const getUserQuery = `SELECT email, username, profile_picture FROM users WHERE user_id = ${user_id}`;

    pool
        .query(getUserQuery)
        .then((result) => {
            const user = result.rows[0];
            if (!user) {
                return res.status(404).send('User not found');
            }
            const { email, username, profile_picture } = user;
            res.json({ email, username, profile_picture });
        })
        .catch((error) => {
            console.error('Error retrieving user information:', error);
            res.status(500).send('Error retrieving user information');
        });
});

module.exports = router;
