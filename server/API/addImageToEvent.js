const express = require('express');
const pool = require('./database');

const router = express.Router();

router.post('/', async (req, res) => {
    const { user_id, event_id, picture_xs, picture_m, picture_xl } = req.body;

    try {
        // Check if the user is authorized for the event
        const checkAuthorizationQuery = 'SELECT COUNT(*) FROM organizers WHERE event_id = $1 AND user_id = $2';
        const authorizedResult = await pool.query(checkAuthorizationQuery, [event_id, user_id]);

        const isAuthorized = authorizedResult.rows[0].count > 0;
        if (!isAuthorized) {
            console.log('User is not authorized for this event');
            return res.status(401).send('User is not authorized for this event');
        }

        // Insert the record into the pictures table
        const insertPictureQuery = `INSERT INTO pictures (picture_xs, picture_m, picture_xl) VALUES ($1, $2, $3) RETURNING picture_id`;
        const pictureResult = await pool.query(insertPictureQuery, [picture_xs, picture_m, picture_xl]);
        const picture_id = pictureResult.rows[0].picture_id;

        // Insert the record into the gallery table
        const insertGalleryQuery = `INSERT INTO gallery (picture_id, event_id) VALUES ($1, $2)`;
        await pool.query(insertGalleryQuery, [picture_id, event_id]);

        console.log('Image added to event');
        res.send('Image added to event');
    } catch (error) {
        console.error('Error adding image to event:', error);
        res.status(500).send('Error adding image to event');
    }
});

module.exports = router;
