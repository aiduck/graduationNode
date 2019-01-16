var express = require('express');
var router = express.Router();
// api/login
const controller = require('../../db/controller/userLoginController');

// 登录操作
router.get('/login', controller.login);

// token的时间延长
router.get('/authorization', controller.authorization);

module.exports = router