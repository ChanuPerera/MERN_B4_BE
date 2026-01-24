const mongoose = require('mongoose');

exports.uploadFile = async (req , res , next) => {
    try {

        if(!req.file){
            return res.status(400).json({message: "No file uploaded"});

        }
        const bucket = new mongoose.mongo.GridFSBucket(
            mongoose.connection.db,
            {
                bucketName: 'uploads'
            }
        );
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype,
        });

        uploadStream.end(req.file.buffer);
        uploadStream.on('finish', () => {
            res.status(201).json({
                success: true,
                fileId: uploadStream.id,
            })
        })      
    } catch (error) {
        next(error)
    }
}


exports.getImage = async (req, res) => {
    const bucket = new mongoose.mongo.GridFSBucket(
         mongoose.connection.db,
            {
                bucketName: 'uploads'
            }
    )

    bucket
    .openDownloadStream(new mongoose.Types.ObjectId(req.params.id))
    .pipe(res);
}