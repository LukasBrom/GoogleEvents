const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pool = require('./database');

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'images'));
    },
});

const upload = multer({ storage });

function deleteImageFiles(imagePaths) {
    if (!imagePaths) return;

    const uploadPath = path.join(__dirname, 'images');

    imagePaths.forEach((imagePath) => {
        const filePaths = ['.jpg', '.png'].map((extension) => path.join(uploadPath, imagePath + extension));

        filePaths.forEach((filePath) => {
            fs.unlink(filePath, (error) => {
                if (error) {
                    console.error('Error deleting image file:', error);
                } else {
                    console.log('Image file deleted:', filePath);
                }
            });
        });
    });
}

router.delete('/', upload.none(), async (req, res) => {
    const { user_id, event_id, picture_id } = req.body;

    try {
        // Check if the user is authorized for the event
        const checkAuthorizationQuery = 'SELECT COUNT(*) FROM organizers WHERE event_id = $1 AND user_id = $2';
        const authorizedResult = await pool.query(checkAuthorizationQuery, [event_id, user_id]);

        const isAuthorized = authorizedResult.rows[0].count > 0;
        if (!isAuthorized) {
            console.log('User is not authorized for this event');
            return res.status(401).send('User is not authorized for this event');
        }

        // Get the file paths of the images from the pictures table
        const selectPictureQuery = 'SELECT picture_xs, picture_m, picture_xl FROM pictures WHERE picture_id = $1';
        const pictureResult = await pool.query(selectPictureQuery, [picture_id]);
        const { picture_xs, picture_m, picture_xl } = pictureResult.rows[0];

        // Delete the image files from the server
        const imagePaths = [picture_xs, picture_m, picture_xl];
        deleteImageFiles(imagePaths);

        // Delete the record from the gallery table
        const deleteFromGalleryQuery = 'DELETE FROM gallery WHERE event_id = $1 AND picture_id = $2';
        await pool.query(deleteFromGalleryQuery, [event_id, picture_id]);

        // Delete the record from the pictures table
        const deleteFromPicturesQuery = 'DELETE FROM pictures WHERE picture_id = $1';
        await pool.query(deleteFromPicturesQuery, [picture_id]);

        console.log('Image deleted from event');
        res.send('Image deleted from event');
    } catch (error) {
        console.error('Error deleting image from event:', error);
        res.status(500).send('Error deleting image from event');
    }
});

module.exports = router;
