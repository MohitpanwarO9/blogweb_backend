const express = require('express');
const router = express.Router();
const {postCreate,getPost,getSpecificPost} = require('../controller/postController');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});

router.route('/create').post(uploadMiddleware.single('image'),postCreate);
router.route('/getpost').get(getPost);
router.route('/getpost/:id').get(getSpecificPost);

module.exports = router;
