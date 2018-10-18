var express = require('express');
var router = express.Router();
// api/teacherInfo/ *
const controller = require('../../db/controller/teacherInfoController');

// 查询操作
router.get('/queryLimitUser', controller.queryLimitUser); // ok
router.get('/queryUser', controller.queryUser);  //ok
router.post('/queryUserById', controller.queryUserById); // ok


router.post('/queryByFilter', controller.queryByFilter); // ok


// 插入操作
router.post('/insertUserList', controller.insertUserList);  // ok


// 更新操作
router.post('/updateUserInfo',controller.updateUserInfo); // ok


// 删除操作
router.post('/daleteUserList', controller.daleteUserList); // ok




module.exports = router