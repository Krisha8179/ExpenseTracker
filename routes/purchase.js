const express = require('express');
const router = express.Router();
require("dotenv").config();
const userAuthentication = require('../middleware/auth');

const purchaseController = require('../controllers/purchase');


router.get('/purchase/premiummembership',userAuthentication.authenticate,purchaseController.purchasepremium);
router.post('/purchase/updatetransactionstatus',userAuthentication.authenticate,purchaseController.updateTransactionStatus);


module.exports = router;

