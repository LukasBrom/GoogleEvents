const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', async (req, res) => {
    const { language } = req.query;

    try {
        let languageColumn;
        switch (language) {
            case 'de':
                languageColumn = 'text_de';
                break;
            case 'en':
                languageColumn = 'text_en';
                break;
            case 'es':
                languageColumn = 'text_es';
                break;
            default:
                return res.status(400).send('Invalid language');
        }

        const getCategoriesQuery = `SELECT category_id, ${languageColumn} AS category_name FROM category_i18n`;

        const categoriesResult = await pool.query(getCategoriesQuery);
        const categories = categoriesResult.rows;

        res.json(categories);
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).send('Error getting categories');
    }
});

module.exports = router;
