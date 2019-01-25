var express = require('express');
var router = express.Router();
// api/projectReport/ *
const controller = require('../../db/controller/projectReportController');

// 验证以及返回项目ID列表
router.post('/checkUserIdAndRetPro', controller.checkUserIdAndRetPro);

// 添加信息前，检查是否已经存在该项目成果了
router.post('/queryRepByProId', controller.queryRepByProId);

// 插入操作
router.post('/inster', controller.inster);

// 用户查询接口
router.get('/queryReport', controller.queryReport);

// 查询特定的日报信息
router.post('/queryReportById', controller.queryReportById);

// 修改日报信息
router.post('/updateReport', controller.updateReport);

// 删除日报信息
router.post('/deleteReport', controller.deleteReport);

// 筛选
router.post('/queryByFilter', controller.queryByFilter);


module.exports = router