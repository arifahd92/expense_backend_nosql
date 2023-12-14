const express = require ('express');
const {verify} = require ('../controllers/verify');
const router = express.Router ();
router.post ('/verify-user', verify);
module.exports = router;
