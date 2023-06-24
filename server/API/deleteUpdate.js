const express = require('express');
const pool = require('./database');

const router = express.Router();


router.delete('/', async (req, res) => {
    const { update_id, user_id } = req.body;

    try {
        // Check if the user is authorized to delete the update
        const checkAuthorizationQuery = `
            SELECT user_id
            FROM organizers
                     INNER JOIN updates ON organizers.event_id = updates.event_id
            WHERE updates.update_id = '${update_id}'::uuid AND organizers.user_id = '${user_id}'::uuid
        `;
        const authorizationResult = await pool.query(checkAuthorizationQuery);
        if (authorizationResult.rows.length === 0) {
            return res.status(401).send('User is not authorized to delete the update or update does not exist');
        }

        // Delete the specified update
        const deleteUpdateQuery = `
            DELETE FROM updates
            WHERE update_id = '${update_id}'::uuid
        `;
        await pool.query(deleteUpdateQuery);

        console.log('Update deleted');
        res.send('Update deleted');

    } catch (error) {
        console.error('Error deleting update:', error);
        res.status(500).send('Error deleting update');
    }
});

module.exports = router;
