const express = require('express');
const router = express.Router();
const upload = require('../../middleware/uploadMemory')
const { uploadFile} = require('../../controllers/upload/upload.controller');


router.post('/upload', upload.single('image'), uploadFile);



module.exports = router;

