const express = require('express');
const pool = require('./database');

const router = express.Router();

router.delete('/', async (req, res) => {
    const list_id = req.body.list_id;
    const user_id = req.body.user_id;

    try {
        // Check if the list ID exists in the favourite_list table and corresponds to the user ID
        const checkListQuery = `SELECT * FROM favourite_lists WHERE list_id = '${list_id}'::uuid AND user_id = '${user_id}'::uuid`;
        const checkListResult = await pool.query(checkListQuery);
        const list = checkListResult.rows[0];
        if (!list) {
            return res.status(404).send('List not found or unauthorized');
        }
        // Delete the favorites associated with the list ID from the favourite table
        const deleteFavoritesQuery = `DELETE FROM favourites WHERE list_id = '${list_id}'::uuid`;
        await pool.query(deleteFavoritesQuery);

        // Delete the entry from the favourite_list table
        const deleteListQuery = `DELETE FROM favourite_lists WHERE list_id = '${list_id}'::uuid AND user_id = '${user_id}'::uuid`;
        await pool.query(deleteListQuery);

        console.log('Favorite list and corresponding favorites deleted');
        res.send('Favorite list and corresponding favorites deleted');
    } catch (error) {
        console.error('Error deleting favorite list:', error);
        res.status(500).send('Error deleting favorite list');
    }
});

module.exports = router;
