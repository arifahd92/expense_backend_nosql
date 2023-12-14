const express = require ('express');
const {buyPremium, paymentSuccess} = require ('../controllers/razor');
const {findId} = require ('../middleware/authenticate');
const router = express.Router ();
router.get ('/buy-premium', findId, buyPremium);
router.post ('/payment-success', findId, paymentSuccess);
module.exports = router;
