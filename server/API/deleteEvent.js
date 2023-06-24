const express = require('express');
const pool = require('./database');

const router = express.Router();

router.delete('/', async (req, res) => {
    const event_id = req.body.eventID;
    const user_id = req.body.userID;

    try {
        const checkAuthorizationQuery = `SELECT * FROM organizers WHERE user_id = '${user_id}'::uuid AND event_id = '${event_id}'::uuid`;
        const authorizationResult = await pool.query(checkAuthorizationQuery);
        const authorization = authorizationResult.rows[0];

        if (!authorization) {
            return res.status(403).send('Unauthorized'); // Return 403 Forbidden if the user is not authorized
        }


        // Get the text IDs related to the event
        const getTextIdsQuery = `SELECT title, description 
                                 FROM events 
                                 WHERE event_id = '${event_id}'::uuid`;
        const textIdsResult = await pool.query(getTextIdsQuery);
        const textIds = textIdsResult.rows[0];

        if (!textIds) {
            return res.status(404).send('Event not found');
        }

        const deleteMappingQuery = `DELETE FROM organizers WHERE event_id = '${event_id}'::uuid`;
        await pool.query(deleteMappingQuery);

        const deleteEventQuery = `DELETE FROM events WHERE event_id = '${event_id}'::uuid`;
        await pool.query(deleteEventQuery);

        const { event_title, event_description } = textIds;

        // Delete the corresponding text entries from text_i18n
        const deleteTextQueries = [];

        if (event_title) {
            const deleteTitleQuery = `DELETE FROM text_i18n WHERE text_id = '${event_title}'::uuid`;
            deleteTextQueries.push(pool.query(deleteTitleQuery));
        }
        if (event_description) {
            const deleteDescriptionQuery = `DELETE FROM text_i18n WHERE text_id = '${event_description}'::uuid`;
            deleteTextQueries.push(pool.query(deleteDescriptionQuery));
        }

        await Promise.all(deleteTextQueries);

        // Delete the event from event_list table


        console.log('Event and dependencies deleted');
        res.send('Event and dependencies deleted');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Error deleting event');
    }
});

module.exports = router;