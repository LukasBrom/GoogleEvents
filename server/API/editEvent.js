const express = require('express');
const pool = require('./database');

const router = express.Router();

router.patch('/', async (req, res) => {
    const event_id = req.body.eventID;
    const eventData = req.body;
    const user_id = eventData.userID;
    console.log('Received Event Data:', eventData);

    try {
        // Check if the user is authorized to edit the event
        const checkAuthorizationQuery = `SELECT * FROM organizers WHERE user_id = '${user_id}'::uuid AND event_id = '${event_id}'::uuid;`;
        const authorizationResult = await pool.query(checkAuthorizationQuery);
        const authorization = authorizationResult.rows[0];
        if (!authorization) {
            return res.status(403).send('Unauthorized'); // Return 403 Forbidden if the user is not authorized
        }
        // Get the event details
        const getEventQuery = `SELECT * FROM events WHERE event_id = '${event_id}'::uuid;`;
        const eventResult = await pool.query(getEventQuery);
        const event = eventResult.rows[0];

        if (!event) {
            return res.status(404).send('Event not found');
        }
        // Update the text values in text_i18n table
        const updateTextQueries = [];
        if (eventData.eventTitle) {
            const updateTitleQuery = `UPDATE text_i18n SET text_en = '${eventData.eventTitle}' WHERE text_id = '${event.event_title}'::uuid`;
            updateTextQueries.push(pool.query(updateTitleQuery));
        }
        if (eventData.eventCategory) {
            const getCategoryQuery = `SELECT category_id FROM category_i18n WHERE text_en = '${eventData.eventCategory.value}'`;
            const categoryResult = await pool.query(getCategoryQuery);
            const category = categoryResult.rows[0];

            if (!category) {
                return res.status(404).send('Category not found');
            }
            const updateCategoryQuery = `UPDATE events SET category = '${category.category_id}'::uuid WHERE event_id = ${event_id}`;
            updateTextQueries.push(pool.query(updateCategoryQuery));
        }
        if (eventData.eventDescription) {
            const updateDescriptionQuery = `UPDATE text_i18n SET text_en = '${eventData.eventDescription}' WHERE text_id = '${event.event_description}'::uuid`;
            updateTextQueries.push(pool.query(updateDescriptionQuery));
        }
        if (eventData.eventCity) {
            const getCityQuery = `SELECT city_id FROM city_i18n WHERE text_en = '${eventData.eventCity}'`;
            const cityResult = await pool.query(getCityQuery);
            const city = cityResult.rows[0];
            if (!city) {
                return res.status(404).send('City not found');
            }

            const updateCityQuery = `UPDATE events SET city = '${city.text_id}'::uuid WHERE event_id = '${event_id}'::uuid`;
            updateTextQueries.push(pool.query(updateCityQuery));
        }
        if (eventData.eventPriceCat) {
            const updatePriceCatQuery = `UPDATE events SET price_category = '${eventData.eventPriceCat.value}' WHERE event_id = '${event_id}'::uuid;`;
            updateTextQueries.push(pool.query(updatePriceCatQuery));
        }
        if (eventData.eventLongitude) {
            const updateLongitudeQuery = `UPDATE events SET longitude = '${eventData.eventLongitude}' WHERE event_id = '${event_id}'::uuid;`;
            updateTextQueries.push(pool.query(updateLongitudeQuery));
        }
        if (eventData.eventLatitude) {
            const updateLatitudeQuery = `UPDATE events SET latitude = '${eventData.eventLatitude}' WHERE event_id = '${event_id}'::uuid;`;
            updateTextQueries.push(pool.query(updateLatitudeQuery));
        }
        await Promise.all(updateTextQueries);

        console.log('Event Data Updated');
        res.send('Event Data Updated');
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).send('Error updating event');
    }
});

module.exports = router;
