const express = require('express');
const pool = require('./database');

const router = express.Router();

router.delete('/', (req, res) => {
    const user_id = "'" + req.body.user_id + "'";

    const deleteUserQuery = `DELETE FROM users WHERE user_id = ${user_id}`;

    pool
        .query(deleteUserQuery)
        .then(() => {
            console.log('User Deleted');
            res.send('User Deleted');
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
            res.status(500).send('Error deleting user');
        });
});

module.exports = router;