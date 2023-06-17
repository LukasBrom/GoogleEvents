const express = require('express');
const pool = require('./database');

const router = express.Router();

router.post('/', async (req, res) => {
    const { user_id, list_id, event_id } = req.body;

    try {
        // Check if the list_id exists in favourite_list table and corresponds to the user_id
        const checkListQuery = `SELECT * FROM favourite_lists WHERE list_id = '${list_id}'::uuid AND user_id = '${user_id}'::uuid`;
        const listResult = await pool.query(checkListQuery);
        const list = listResult.rows[0];

        if (!list) {
            return res.status(404).send('Favourite list does not exist or User ID is not correct');
        }

        // Check if the event_id exists in event_list table
        const checkEventQuery = `SELECT * FROM events WHERE event_id = '${event_id}'::uuid`;
        const eventResult = await pool.query(checkEventQuery);
        const event = eventResult.rows[0];

        if (!event) {
            return res.status(404).send('Event not found');
        }

        // Insert the new favourite
        const insertFavouriteQuery = `INSERT INTO favourites (list_id, event_id) VALUES ('${list_id}'::uuid, '${event_id}'::uuid)`;
        await pool.query(insertFavouriteQuery);

        console.log('Favourite added');
        res.send('Favourite added');
    } catch (error) {
        console.error('Error adding favourite:', error);
        res.status(500).send('Error adding favourite');
    }
});

module.exports = router;
