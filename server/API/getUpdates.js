const express = require('express');
const pool = require('./database');

const router = express.Router();


router.get('/', async (req, res) => {
    const { event_id } = req.body;

    try {
        // Retrieve updates for the specified event
        const getUpdatesQuery = `
            SELECT u.update_id, t.text_en, t.text_de, t.text_es
            FROM updates u
            INNER JOIN text_i18n t ON u.text_id = t.text_id
            WHERE u.event_id = '${event_id}'::uuid
        `;
        const updatesResult = await pool.query(getUpdatesQuery);
        const updates = updatesResult.rows;

        console.log('Updates retrieved');
        res.json(updates);
    } catch (error) {
        console.error('Error retrieving updates:', error);
        res.status(500).send('Error retrieving updates');
    }
});

module.exports = router;