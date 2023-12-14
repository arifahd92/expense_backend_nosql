const express = require ('express');
const {login} = require ('../controllers/login');
const {generateToken} = require ('../middleware/generateToken');
const router = express.Router ();

router.post ('/login', generateToken, login);
module.exports = router;
