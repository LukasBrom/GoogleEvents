const express = require('express');
const pool = require('./database');

const router = express.Router();

router.post('/', async (req, res) => {
    const { event_id, user_id, text_en, text_de, text_es } = req.body;

    try {
        // Check if the user is authenticated as an organizer for the event
        const checkAuthenticationQuery = `
      SELECT user_id
      FROM organizers
      WHERE user_id = '${user_id}'::uuid AND event_id = '${event_id}'::uuid
    `;
        const authenticationResult = await pool.query(checkAuthenticationQuery);
        if (authenticationResult.rows.length === 0) {
            return res.status(401).send('User is not authenticated as an organizer');
        }

        // Insert the update text into the text_i18n table
        const insertTextQuery = `
      INSERT INTO text_i18n (text_en, text_de, text_es)
      VALUES ('${text_en}', '${text_de}', '${text_es}')
      RETURNING text_id`;
        console.log(insertTextQuery);
        const textInsertResult = await pool.query(insertTextQuery);
        const textId = textInsertResult.rows[0].text_id;

        // Insert the update into the updates table
        const insertUpdateQuery = `
      INSERT INTO updates (text_id, event_id)
      VALUES ('${textId}'::uuid, '${event_id}'::uuid)
    `;
        await pool.query(insertUpdateQuery);

        console.log('Update added');
        res.send('Update added');
    } catch (error) {
        console.error('Error adding update:', error);
        res.status(500).send('Error adding update');
    }
});

module.exports = router;
