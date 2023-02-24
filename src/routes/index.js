const express = require('express');
const { sendMailHTTP } = require('../controllers/sendMail');

const router = express.Router();

router.post('/', sendMailHTTP);

module.exports = router;
