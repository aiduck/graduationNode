var express = require('express');
var router = express.Router();
// api/studentInfo/ *
const controller = require('../../db/controller/studentInfoController');

// 查询操作
router.get('/queryLimitUser', controller.queryLimitUser); 
router.get('/queryUser', controller.queryUser);  
router.post('/queryUserById', controller.queryUserById); 


router.post('/queryByFilter', controller.queryByFilter); 


// 插入操作
router.post('/insertUserList', controller.insertUserList);  


// 更新操作
router.post('/updateUserInfo',controller.updateUserInfo); 


// 删除操作
router.post('/daleteUserList', controller.daleteUserList); 




module.exports = router