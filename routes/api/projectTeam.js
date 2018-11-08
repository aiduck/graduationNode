var express = require('express');
var router = express.Router();
// api/projectTeam/ *
const controller = require('../../db/controller/projectTeamController')

// 插入操作
router.post('/insterProjectTeam', controller.insterProjectTeam);

// 查询操作
router.get('/queryLimitTeam', controller.queryLimitTeam);

// 删除操作
router.post('/deleteTeam',controller.deleteTeam);

// 筛选信息
router.post('/queryByFilter', controller.queryByFilter);

// 获取team，project，studentList，classes
router.post('/queryById', controller.queryById);

// 更新课程信息
router.post('/updateProjectTeamInfo', controller.updateProjectTeamInfo);

// 插入成员
router.post('/insertTeamMember', controller.insertTeamMember);

// 删除成员
router.post('/deleteTeamMember', controller.deleteTeamMember);



module.exports = router