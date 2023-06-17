const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', (req, res) => {
    const event_id = req.body.event_id;

    const getEventQuery = `SELECT * FROM events WHERE event_id = ${event_id};`;

    pool
        .query(getEventQuery)
        .then((result) => {
            const event = result.rows[0];
            res.json(event);
        })
        .catch((error) => {
            console.error('Error retrieving event:', error);
            res.status(500).send('Error retrieving event');
        });
});

module.exports = router;
