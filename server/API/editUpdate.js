const express = require('express');
const pool = require('./database');

const router = express.Router();

router.patch('/', async (req, res) => {
    const { update_id, user_id, text_en, text_de, text_es } = req.body;

    try {
        // Check if the user is authorized to edit the update
        const checkAuthorizationQuery = `
            SELECT user_id
            FROM organizers
            INNER JOIN updates ON organizers.event_id = updates.event_id
            WHERE updates.update_id = '${update_id}'::uuid AND organizers.user_id = '${user_id}'::uuid
        `;
        const authorizationResult = await pool.query(checkAuthorizationQuery);
        if (authorizationResult.rows.length === 0) {
            return res.status(401).send('User is not authorized to edit the update');
        }

        // Update the specified update
        const updateFields = [];
        const updateValues = [];
        if (text_en) {
            updateFields.push('text_en');
            updateValues.push(text_en);
        }
        if (text_de) {
            updateFields.push('text_de');
            updateValues.push(text_de);
        }
        if (text_es) {
            updateFields.push('text_es');
            updateValues.push(text_es);
        }

        if (updateFields.length === 0) {
            // No text fields provided, return without making any updates
            return res.status(400).send('No text fields provided for update');
        }

        const updateUpdateQuery = `
            UPDATE text_i18n
            SET ${updateFields.map((field, index) => `${field} = $${index + 1}`).join(', ')}
            WHERE text_id = (
                SELECT text_id
                FROM updates
                WHERE update_id = '${update_id}'::uuid
            )
        `;
        await pool.query(updateUpdateQuery, updateValues);

        console.log('Update edited');
        res.send('Update edited');
    } catch (error) {
        console.error('Error editing update:', error);
        res.status(500).send('Error editing update');
    }
});



module.exports = router;