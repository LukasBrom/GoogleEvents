const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', async (req, res) => {
    const language = req.query.language;

    let textField;
    switch (language) {
        case 'de':
            textField = 'text_de';
            break;
        case 'en':
            textField = 'text_en';
            break;
        case 'es':
            textField = 'text_es';
            break;
        default:
            return res.status(400).send('Invalid language');
    }

    try {
        const getCitiesQuery = `SELECT city_id, ${textField} AS city_text FROM city_i18n`;
        const citiesResult = await pool.query(getCitiesQuery);
        const cities = citiesResult.rows;

        res.json(cities);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).send('Error fetching cities');
    }
});

module.exports = router;
