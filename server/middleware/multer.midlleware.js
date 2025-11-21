const multer = require('multer');

const storage = multer.memoryStorage();

//single upload
const singleUpload = multer({ storage }).single('file');

//multiple upload
const multipleUpload = multer({ storage }).array('files', 5); //max 5 files

module.exports = { singleUpload, multipleUpload };