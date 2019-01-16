var express = require('express');
var router = express.Router();
// api/authlist
const controller = require('../../db/controller/authController');

// 登录后获取路由权限
router.get('/authlist', controller.authRouteList);


module.exports = router