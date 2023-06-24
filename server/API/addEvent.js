const express = require("express");
const router = express.Router();
const pool = require("./database");

router.post("/", async (req, res) => {
    const eventData = req.body;
    console.log("Received Event Data:", eventData);

    const {userID, eventTitle, eventDescription, eventCategory, eventCity, eventStartDate, eventEndDate, eventStartTime, eventEndTime, eventPriceCat, eventLongitude,
        eventLatitude, eventStreetNumber, eventPostcode } = eventData;
        
    let titleID, categoryID, cityID, description_id;
    const insertTitle = `INSERT INTO text_i18n (text_en) VALUES('${eventTitle}') RETURNING text_id;`
    const getTitleID = `SELECT text_id FROM text_i18n WHERE text_en = '${eventTitle}';`
    const getCatID = `SELECT category_id FROM category_i18n WHERE text_en = '${eventCategory}';`
    const insertDescr = `INSERT INTO text_i18n(text_en)  VALUES ('${eventDescription}') RETURNING text_id;`
    const getCityID = `SELECT city_id FROM city_i18n WHERE text_en = '${eventCity}';`
    try {
        console.log(eventData);
        const [result1, result2, result3] = await Promise.all([
            pool.query(getTitleID),
            pool.query(getCatID),
            pool.query(getCityID)
        ]);
        titleID = result1.rows[0];
        categoryID = result2.rows[0].category_id;
        cityID = result3.rows[0].city_id;
        if (titleID != null) {
            res.status(500).send("Event with Same title already exists");
        } else {
            const insertTitleResult = await pool.query(insertTitle);
            titleID = insertTitleResult.rows[0].text_id;
            const insertDescrResult = await pool.query(insertDescr);
            description_id = insertDescrResult.rows[0].text_id;
            const insertStmt = `INSERT INTO events (title, description, category, city, start_date, end_date, start_time, end_time, price_category, longitude, latitude, street_number, postcode) 
                        VALUES ('${titleID}'::uuid, '${description_id}'::uuid, '${categoryID}'::uuid, '${cityID}'::uuid, '${eventStartDate}'::date, '${eventEndDate}'::date, '${eventStartTime}'::time, '${eventEndTime}'::time, '${eventPriceCat}',
                          '${eventLongitude}', '${eventLatitude}', '${eventStreetNumber}', '${eventPostcode}') RETURNING event_id;`;
            console.log(insertStmt)
            const insertResult = await pool.query(insertStmt);
            const event_id = insertResult.rows[0].event_id;
            const insertMappingQuery = `INSERT INTO organizers (user_id, event_id) VALUES ('${userID}'::uuid, '${event_id}'::uuid)`;
            await pool.query(insertMappingQuery);
            console.log("Event Data Saved");
            res.send("Event Data Saved");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error saving Event Data");
    }
});

module.exports = router;
