const express = require('express');
const pool = require('./database');

const router = express.Router();

router.post('/', async (req, res) => {
    const { user_id, list_name } = req.body;

    try {
        // Insert a new favourite list into the database
        const insertListQuery = `INSERT INTO favourite_lists (user_id, list_name) VALUES ('${user_id}'::uuid, '${list_name}')`;
        await pool.query(insertListQuery);

        console.log('New favourite list added');
        res.send('New favourite list added');
    } catch (error) {
        console.error('Error adding favourite list:', error);
        res.status(500).send('Error adding favourite list');
    }
});

module.exports = router;
