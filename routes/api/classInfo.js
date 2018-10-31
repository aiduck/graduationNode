var express = require('express');
var router = express.Router();
// api/classInfo/ *
const controller = require('../../db/controller/classInfoController')

// 插入操作
router.post('/insterClass', controller.insterClass);
// 查询操作
router.get('/queryLimitClass', controller.queryLimitClass);

// 修改状态
router.post('/updateClassStatus', controller.updateClassStatus);

// 查询特殊个体
router.post('/queryById', controller.queryById);

// 更新课程信息
router.post('/updateClassInfo', controller.updateClassInfo);

// 筛选信息
router.post('/queryByFilter', controller.queryByFilter);

// 删除信息
router.post('/daleteClassList', controller.daleteClassList);


module.exports = router