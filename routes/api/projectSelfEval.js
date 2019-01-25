var express = require('express');
var router = express.Router();
// api/projectSelfEval/ *
const controller = require('../../db/controller/projectSelfEvalController');


// 添加信息前，检查是否已经存在该项目成果了
router.post('/querySelfByProId', controller.querySelfByProId);
// 插入操作
router.post('/inster', controller.inster);
// 用户查询接口
router.get('/querySelf', controller.querySelf);
// 删除操作
router.post('/deleteSelf', controller.deleteSelf);
// 查询详细自评
router.post('/querySelfById', controller.querySelfById);
// 更新详细自评
router.post('/updataSelf', controller.updataSelf);

// 筛选
router.post('/queryByFilter', controller.queryByFilter);






module.exports = router