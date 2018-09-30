var express = require('express');
var router = express.Router();

const controller = require('../../db/controller/basicInfoController')

router.get('/queryCollege', controller.queryCollege);
router.post('/queryMajor', controller.queryMajor);
router.post('/queryAdClass', controller.queryAdClass);


module.exports = router