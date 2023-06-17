const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', async (req, res) => {
    const { longitude, latitude, radius } = req.query;

    try {
        // Calculate the latitude and longitude boundaries for the given radius
        const earthRadius = 6371; // Earth's radius in kilometers
        const maxLatitude = parseFloat(latitude) + (parseFloat(radius) / earthRadius) * (180 / Math.PI);
        const minLatitude = parseFloat(latitude) - (parseFloat(radius) / earthRadius) * (180 / Math.PI);
        const maxLongitude = parseFloat(longitude) + (parseFloat(radius) / earthRadius) * (180 / Math.PI) / Math.cos(parseFloat(latitude) * (Math.PI / 180));
        const minLongitude = parseFloat(longitude) - (parseFloat(radius) / earthRadius) * (180 / Math.PI) / Math.cos(parseFloat(latitude) * (Math.PI / 180));

        // Query the events within the specified latitude and longitude boundaries
        const getEventsQuery = `SELECT * FROM events
                                WHERE latitude BETWEEN ${minLatitude} AND ${maxLatitude}
                                AND longitude BETWEEN ${minLongitude} AND ${maxLongitude}`;

        const eventsResult = await pool.query(getEventsQuery);
        const events = eventsResult.rows;

        res.json(events);
    } catch (error) {
        console.error('Error retrieving events by location:', error);
        res.status(500).send('Error retrieving events by location');
    }
});

module.exports = router;
