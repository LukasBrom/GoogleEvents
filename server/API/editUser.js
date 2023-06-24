const express = require('express');
const pool = require('./database');

const router = express.Router();

router.patch('/', async (req, res) => {
    const { password, email, profile_picture } = req.body;
    const user_id = "'" + req.body.user_id + "'";
    try {
        const getUserQuery = `SELECT * FROM users WHERE user_id = ${user_id}`;
        console.log(getUserQuery);
        const userResult = await pool.query(getUserQuery);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).send('User not found');
        }

        const updates = [];

        if (password) {
            updates.push(`password = '${password}'`);
        }
        if (email) {
            updates.push(`email = '${email}'`);
        }
        if (profile_picture) {
            updates.push(`profile_picture = '${profile_picture}'`);
        }

        if (updates.length === 0) {
            return res.status(400).send('No updates provided');
        }

        const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE user_id = ${user_id}`;
        console.log(updateQuery);
        await pool.query(updateQuery);

        console.log('User Data Updated');
        res.send('User Data Updated');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

module.exports = router;
