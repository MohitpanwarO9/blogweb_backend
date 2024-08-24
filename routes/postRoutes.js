const express = require('express');
const router = express.Router();
const {postCreate,getPost,getSpecificPost,editPost} = require('../controller/postController');
const multer = require('multer');
const uploadMiddleware = multer({dest: 'uploads/'});

router.route('/create').post(uploadMiddleware.single('image'),postCreate);
router.route('/getpost').get(getPost);
router.route('/getpost/:id').get(getSpecificPost);
router.route('/edit/:id').put(uploadMiddleware.single('image'),editPost);

module.exports = router;
