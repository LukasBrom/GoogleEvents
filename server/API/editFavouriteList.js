const express = require('express');
const pool = require('./database');

const router = express.Router();

router.patch('/', async (req, res) => {
    const { user_id, list_id, list_name } = req.body;

    try {
        // Update the name of the favourite list
        const checkAuthorization = `SELECT list_id FROM favourite_lists WHERE user_id = '${user_id}'::uuid AND list_id = '${list_id}'::uuid`;
        const isAuthorized = await pool.query(checkAuthorization);
        console.log(isAuthorized);
        if (isAuthorized.rows[0] == null){
            return res.status(403).send('Not Authorized');
        }
        const updateListQuery = `UPDATE favourite_lists SET list_name = '${list_name}' WHERE list_id = '${list_id}'::uuid`;
        await pool.query(updateListQuery);

        console.log('Favourite list updated');
        res.send('Favourite list updated');
    } catch (error) {
        console.error('Error updating favourite list:', error);
        res.status(500).send('Error updating favourite list');
    }
});

module.exports = router;
