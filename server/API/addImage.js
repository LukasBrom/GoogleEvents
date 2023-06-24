const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: 'images',
    filename: (req, file, cb) => {
        const uniqueName = uuidv4();
        const extension = file.originalname.split('.').pop();
        const fileName = `${uniqueName}.${extension}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

class AddImage {
    static uploadImage(req, res) {
        upload.single('image')(req, res, (err) => {
            if (err) {
                return res.status(400).send('Fehler beim Hochladen des Bildes.');
            }

            if (!req.file) {
                return res.status(400).send('Kein Bild hochgeladen.');
            }

            const imageUuid = req.file.filename.split('.')[0];

            // Hier kannst du weitere Logik implementieren, um das Bild zu verarbeiten, z.B. speichern in einer Datenbank oder Ausführen von Aktionen

            return res.status(200).send(imageUuid);
        });
    }
}

module.exports = AddImage;
