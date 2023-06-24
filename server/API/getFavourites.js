const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', async (req, res) => {
    const user_id = req.body.user_id;
    const list_id = req.body.list_id;

    try {
        // Check if the list ID exists in the favourite_list table
        const checkListQuery = `SELECT * FROM favourite_lists WHERE list_id = '${list_id}'::uuid`;
        const checkListResult = await pool.query(checkListQuery);
        const list = checkListResult.rows[0];

        if (!list) {
            return res.status(404).send('List not found');
        }

        // Get the favorites associated with the list ID
        const getFavoritesQuery = `SELECT * FROM favourites WHERE list_id = '${list_id}'::uuid`;
        const getFavoritesResult = await pool.query(getFavoritesQuery);
        const favorites = getFavoritesResult.rows;

        console.log('Favorites retrieved');
        res.json(favorites);
    } catch (error) {
        console.error('Error retrieving favorites:', error);
        res.status(500).send('Error retrieving favorites');
    }
});

module.exports = router;
