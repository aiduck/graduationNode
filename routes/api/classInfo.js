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

// 插入班级成员
router.post('/insterClassMemeber', controller.insterClassMemeber);

// 查询班级成员
router.get('/queryLimitClassMemeber', controller.queryLimitClassMemeber);

// 筛选班级成员信息
router.post('/queryByFilterMemeber', controller.queryByFilterMemeber);

// 删除班级成员信息
router.post('/daleteClassMemeberList', controller.daleteClassMemeberList);

// 导出信息（不筛选）
router.get('/queryAllClassMemeber', controller.queryAllClassMemeber);

router.post('/queryAllClassMemeberFilter', controller.queryAllClassMemeberFilter);

// 获取所有课程信息
router.get('/queryAll', controller.queryAll);
//  获取班级名称
router.post('/queryByIdForName', controller.queryByIdForName);
// 获取班级中所有stu的id
router.post('/queryStuByClassId', controller.queryStuByClassId);
module.exports = router