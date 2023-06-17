const express = require('express');
const pool = require('./database');

const router = express.Router();

router.delete('/', async (req, res) => {
    const favourite_id = req.body.favourite_id;
    const user_id = req.body.user_id;

    try {
        // Get the favorite details from the favourite table
        const getFavoriteQuery = `SELECT * FROM favourites WHERE favourite_id = '${favourite_id}'::uuid`;
        const getFavoriteResult = await pool.query(getFavoriteQuery);
        const favorite = getFavoriteResult.rows[0];

        if (!favorite) {
            return res.status(404).send('Favorite not found');
        }

        // Get the list ID associated with the favorite
        const list_id = favorite.list_id;
        // Check if the list ID corresponds to the user ID in the favourite_list table
        const checkListQuery = `SELECT * FROM favourite_lists WHERE list_id = '${list_id}'::uuid AND user_id = '${user_id}'::uuid`;
        const checkListResult = await pool.query(checkListQuery);
        const list = checkListResult.rows[0];

        if (!list) {
            return res.status(403).send('Unauthorized'); // Return 403 Forbidden if the list does not correspond to the user
        }

        // Delete the favorite from the favourite table
        const deleteFavoriteQuery = `DELETE FROM favourites WHERE favourite_id = '${favourite_id}'::uuid`;
        await pool.query(deleteFavoriteQuery);

        console.log('Favorite deleted');
        res.send('Favorite deleted');
    } catch (error) {
        console.error('Error deleting favorite:', error);
        res.status(500).send('Error deleting favorite');
    }
});

module.exports = router;
