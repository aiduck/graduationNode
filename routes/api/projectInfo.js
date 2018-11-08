var express = require('express');
var router = express.Router();
// api/projectInfo/ *
const controller = require('../../db/controller/projectInfoController')

// 插入操作
router.post('/insterProject', controller.insterProject);
// 查询操作
router.get('/queryLimitProject', controller.queryLimitProject);
// 状态改变
router.post('/updateProjectStatus', controller.updateProjectStatus);
// 查询特殊个体
router.post('/queryById', controller.queryById);
// 更新课程信息
router.post('/updateProjectInfo', controller.updateProjectInfo);

// 筛选信息
router.post('/queryByFilter', controller.queryByFilter);
// 查询课程的Pro
router.post('/queryProByCourseID', controller.queryProByCourseID);
// 查询pro的名称
router.post('/queryByIdForName', controller.queryByIdForName);  



module.exports = router