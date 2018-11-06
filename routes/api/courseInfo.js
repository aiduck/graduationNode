var express = require('express');
var router = express.Router();
// api/courseInfo/ *
const controller = require('../../db/controller/courseInfoController')

// 插入操作
router.post('/insterCourse', controller.insterCourse);
// 查询操作
router.get('/queryLimitCourse', controller.queryLimitCourse);
// 状态改变
router.post('/updateCourseStatus', controller.updateCourseStatus);

// 筛选信息
router.post('/queryByFilter', controller.queryByFilter);

// 获取课程
router.post('/queryCourseById', controller.queryCourseById);
//  班级信息中的获取课程名称
router.post('/queryByIdForName', controller.queryByIdForName);
// 更新课程信息
router.post('/updateCourseInfo', controller.updateCourseInfo);

// 删除课程
router.post('/daleteCourseList', controller.daleteCourseList);

// 获取所有课程信息
router.get('/queryAll', controller.queryAll);

module.exports = router