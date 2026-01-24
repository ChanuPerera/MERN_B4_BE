const mongoose = require('mongoose');
const Grid = require('gridfs-stream');


let gfs;

const connectGridFS = () => {
    const conn = mongoose.connection;
    Grid.mongo = mongoose.mongo;

    gfs = Grid(conn.db);
    gfs.collection('uploads'); //// create uploads.files and uploads.chunks collections
}


module.exports = { connectGridFS, getGFS: () => gfs};