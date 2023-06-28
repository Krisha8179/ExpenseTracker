const express = require('express');
const router = express.Router();

const premiumFeatureController = require('../controllers/premiumFeature');
const userAuthentication = require('../middleware/auth');

router.get('/premium/feature',userAuthentication.authenticate,premiumFeatureController.getUserLeaderBoard);

module.exports = router;