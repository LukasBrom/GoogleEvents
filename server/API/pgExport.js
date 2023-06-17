const express = require('express');
const pool = require('./database');

const router = express.Router();

router.get('/', (req, res) => {
    // Define an array of table names
    const tableNames = ['pg_stat_bgwriter', 'pg_stat_database'];

    // Create an empty string to store the metrics
    let allMetrics = '';

    // Create an array of promises to fetch data from each table
    const fetchPromises = tableNames.map((tableName) => {
        const query = `SELECT *
                       FROM ${tableName}`;

        let metrics = ''; // Separate metrics variable for each table

        return pool.query(query)
            .then((result) => {
                if (result.rows.length > 1) {
                    metrics += '# Metrics from ' + tableName + '\n';
                    switch (tableName) {
                        case 'pg_stat_database':
                            metrics += handle_pg_stat_database(result);
                            break;
                        default:
                            break;
                    }
                } else {
                    Object.entries(result.rows[0]).forEach(([key, value]) => {
                        if (value !== null && /^[0-9]+$/.test(value)) {
                            metrics += tableName + "_" + key + " " + value + "\n";
                        }
                    });
                    metrics += '\n';
                }
                // Exclude any unwanted metrics for each table


                handleNullValues(metrics); // Handle null values
                allMetrics += metrics; // Concatenate the metrics
            })
            .catch((error) => {
                console.error(`Error retrieving metrics from ${tableName}:`, error);
                throw error;
            });
    });

    // Wait for all promises to resolve
    Promise.all(fetchPromises)
        .then(() => {
            res.setHeader('Content-Type', 'text/plain');
            res.send(allMetrics);
        })
        .catch((error) => {
            console.error('Error retrieving metrics:', error);
            res.status(500).send('Internal Server Error');
        });
});

function handleNullValues(metrics) {
    for (const key in metrics) {
        if (metrics[key] === null) {
            delete metrics[key]; // Exclude metrics with null values
        }
    }
}

function handle_pg_stat_database(result) {
    let metrics = '';
    for (let i = 0; i < result.rows.length; i++) {
        Object.entries(result.rows[i]).forEach(([key, value]) => {
            if (value !== null && key != "datid" && key !="datname" && result.rows[i].datname !== null) {
                metrics += 'pg_stat_database_'+ key +'{datid="'+ result.rows[i].datid + '",datname="' +
                    result.rows[i].datname + '"} ' + value + "\n";
            }
        });
    }
    metrics += '\n';
    return metrics;
}

module.exports = router;
