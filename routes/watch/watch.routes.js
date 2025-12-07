const express = require('express');
const router = express.Router();
const controller = require('../../controllers/watch/watch.controller');


/// Base route: api/watches
router.get('/', controller.getAllWatches);
// router.get('/:modelNumber', controller.getWatchByModel);
router.post('/create-watch', controller.createWatch);
router.put('/:modelNumber', controller.updateWatch);
// router.delete('/delete-watch/:modelNumber', controller.deleteWatch); 
// router.put('/:modelNumber', controller.updateWatch); 



module.exports = router;

