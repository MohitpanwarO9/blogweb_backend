const express = require('express');
const router = express.Router();
const {postCreate} = require('../controller/postController');

router.route('/create').post(postCreate);

module.exports = router;
