const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', async (req, res) => {
    const userId = req.body.user_id;

    try {
        // Get all favourite lists of the user
        const getListsQuery = `SELECT list_id, list_name FROM favourite_lists WHERE user_id = '${userId}'::uuid`;
        const listsResult = await pool.query(getListsQuery);
        const lists = listsResult.rows;

        console.log('Favourite lists retrieved');
        res.json(lists);
    } catch (error) {
        console.error('Error retrieving favourite lists:', error);
        res.status(500).send('Error retrieving favourite lists');
    }
});

module.exports = router;
