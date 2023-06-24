const express = require('express');
const pool = require('./database');

const router = express.Router();

router.put('/', async (req, res) => {
    const { event_id, user_id, picture_xs, picture_m, picture_xl } = req.body;

    try {
        // Check if the user is authorized for the event
        const checkAuthorizationQuery = 'SELECT COUNT(*) FROM organizers WHERE event_id = $1 AND user_id = $2';
        const authorizedResult = await pool.query(checkAuthorizationQuery, [event_id, user_id]);

        const isAuthorized = authorizedResult.rows[0].count > 0;
        if (!isAuthorized) {
            console.log('User is not authorized for this event');
            return res.status(401).send('User is not authorized for this event');
        }

        const getPictureIdQuery = `SELECT picture_id FROM gallery WHERE event_id = $1`;
        const pictureIdQueryResult = await pool.query(getPictureIdQuery, [event_id]);
        const picture_id =pictureIdQueryResult.rows[0].picture_id;

        // Update the record in the pictures table
        const updatePictureQuery = `UPDATE pictures SET 
            picture_xs = COALESCE($1, picture_xs),
            picture_m = COALESCE($2, picture_m),
            picture_xl = COALESCE($3, picture_xl)
            WHERE picture_id = $4`;
        await pool.query(updatePictureQuery, [picture_xs, picture_m, picture_xl, picture_id]);

        console.log('Image updated');
        res.send('Image updated');
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).send('Error updating image');
    }
});

module.exports = router;
