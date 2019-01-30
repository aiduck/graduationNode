var express = require('express');
var router = express.Router();
// api/projectScore/ *
const controller = require('../../db/controller/projectScoreController');

// table list 查询操作
router.get('/queryProjectScore', controller.queryProjectScore);

// 详细内容查询
router.post('/queryProjectScoreDetail', controller.queryProjectScoreDetail);

// 更新成绩
router.post('/updateScore', controller.updateScore);

// 筛选
router.post('/queryByFilter', controller.queryByFilter);


module.exports = router