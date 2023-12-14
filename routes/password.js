const {updatePassword, forgotPassword} = require ('../controllers/password');
const express = require ('express');

const router = express.Router ();
router.post ('/password/update-password', updatePassword);
router.post ('/password/forgot-password', forgotPassword);
module.exports = router;
