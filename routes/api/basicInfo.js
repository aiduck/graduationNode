var express = require('express');
var router = express.Router();
// api/basicInfo/ *
const controller = require('../../db/controller/basicInfoController')

// 插入操作
router.post('/insertCollege', controller.insterCollege);
router.post('/insertMajor', controller.insterMajor);
router.post('/insertAdclass', controller.insterAdclass);

// 查询操作
router.get('/queryCollege', controller.queryCollege);
router.post('/queryMajor', controller.queryMajor);
router.post('/queryAdClass', controller.queryAdClass);

// 状态操作
router.post('/updateStatus', controller.updateStatus);
router.post('/queryBefupSta', controller.queryColSta);

// 删除操作
router.post('/delAdClass', controller.delAdclass);

// 添加按钮
router.post('/addBasicInfo',controller.addBasicInfo);

module.exports = router