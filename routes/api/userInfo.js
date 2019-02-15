var express = require('express');
var router = express.Router();
// api/userInfo/ *
const controller = require('../../db/controller/userInfoController');

// 查询操作
router.get('/queryLimitUser', controller.queryLimitUser);
router.get('/queryUser', controller.queryUser);
router.post('/queryUserById', controller.queryUserById);
router.post('/queryByFilter', controller.queryByFilter);


// 插入操作
router.post('/insertUserList', controller.insertUserList);


// 更新操作
router.post('/updateStatus', controller.updatedStatus);
router.post('/updatePwc',controller.updatePwc);
router.post('/updateUserInfo',controller.updateUserInfo);

// 删除操作
router.post('/daleteUserList', controller.daleteUserList);

// 导出筛选
router.post('/queryAllFilter', controller.queryAllFilter);

// 个人中心查找用户
router.post('/queryByIdForTeaStu', controller.queryByIdForTeaStu);
// 更新用户信息
router.post('/updateByIdForTeaStu', controller.updateByIdForTeaStu);
// 获取skill
router.get('/querySkill', controller.querySkill);
// 插入或者更新skill
router.post('/insertUpdateSkill', controller.insertUpdateSkill);
// 获取所有项目数据综合
router.get('/queryTotalNum', controller.queryTotalNum);













module.exports = router