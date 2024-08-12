const express = require('express');
const router = express.Router();

const sampleController = require('../controllers/sample');

router.get('/', sampleController.getSample);


module.exports  = router;