const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    const language = req.query.language || 'en'; // Standardmäßig wird Englisch verwendet

    // SQL-Abfrage, um die Event-IDs des Benutzers aus der Tabelle "organizers" abzurufen
    const getEventIdsQuery = `SELECT event_id FROM organizers WHERE user_id = '${user_id}'::uuid;`;

    try {
        const eventIdsResult = await pool.query(getEventIdsQuery);
        const eventIds = eventIdsResult.rows.map(row => row.event_id);

        // SQL-Abfrage, um die vollständigen Informationen der gefundenen Events abzurufen
        const getEventsQuery = `SELECT e.event_id, t.text_${language} AS title, c.text_${language} AS city_name, cat.text_${language} AS category_name
                                FROM events AS e
                                INNER JOIN text_i18n AS t ON e.title = t.text_id::uuid
                                INNER JOIN city_i18n AS c ON e.city = c.city_id::uuid
                                INNER JOIN category_i18n AS cat ON e.category = cat.category_id::uuid
                                WHERE e.event_id IN (${eventIds.map(id => `'${id}'::uuid`).join(',')});`;

        const eventsResult = await pool.query(getEventsQuery);
        const events = eventsResult.rows;
        res.json(events);
    } catch (error) {
        console.error('Error retrieving events:', error);
        res.status(500).send('Error retrieving events');
    }
});

module.exports = router;
