const express = require("express");
const router = express.Router();

const {userRegister, userLogin, checkUser, userLogout} = require("../controller/userController");

router.route('/register').post(userRegister);
router.route('/login').post(userLogin);
router.route('/checkuser').get(checkUser);
router.route('/logout').post(userLogout);


module.exports = router;