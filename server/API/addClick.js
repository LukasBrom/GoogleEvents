const express = require('express');
const pool = require('./database');

const router = express.Router();

router.post('/', async (req, res) => {
    const { event_id } = req.body;

    try {
        // Increment the click count for the specified event

        const incrementClickQuery = `UPDATE events SET clicks = clicks + 1 WHERE event_id = '${event_id}'::uuid`;
        await pool.query(incrementClickQuery);

        console.log('Click added to event:', event_id);
        res.send('Click added to event');
    } catch (error) {
        console.error('Error adding click to event:', error);
        res.status(500).send('Error adding click to event');
    }
});

module.exports = router;
