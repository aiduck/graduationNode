var express = require('express');
var router = express.Router();
// api/projectAchi/ *
const controller = require('../../db/controller/projectAchiController');

const path = require('path')
const multer = require('multer')
const config = require('../../config')

// 添加信息前，检查是否已经存在该项目成果了
router.post('/queryAchiByProId', controller.queryAchiByProId);

// 插入操作
router.post('/inster', controller.inster);

// 用户查询列表接口
router.get('/queryprojectAchiList', controller.queryprojectAchiList);

// 查询详细信息接口
router.post('/queryprojectAchiDetil', controller.queryprojectAchiDetil);

// 修改日报信息
router.post('/updateprojectAchi', controller.updateprojectAchi);

// 收藏
router.post('/collectProjectCase', controller.collectProjectCase);

// init 项目收藏案例库list表格
router.get('/queryAllCase', controller.queryAllCase);

// 用过id查询收藏项目的详细信息
router.post('/queryCaseById', controller.queryCaseById);

// 项目收藏筛选
router.post('/queryCaseByFilter', controller.queryCaseByFilter);

//通过project_id 查询项目成果的成果id
router.post('/queryDelIdByProID', controller.queryDelIdByProID);




/**
 * 动态地生成上传中间件
 * @param {*获取上传路径} key 
 * @param {*表单中的name属性} name 
 */
let getUpload = (key, name) => {
    const storage = multer.diskStorage({
        destination: config.uploadPath[key],
        filename: function (req, file, cb) {
            cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
        }
    })
    const upload = multer({
        storage: storage
    }).single(name)

    return upload
}
const projectUpload = getUpload('fileDemo', 'uploadFile')

// 文件上传
router.post('/saveAchifile', projectUpload, controller.saveAchifile);

// 文件信息list加载
router.post('/getAchifileList', controller.getAchifileList);


// 文件下载
router.get('/download', (req, res, next) => {
    let { filename, filepath } = req.query
    console.log(filename, filepath)
    filepath = unescape(filepath)
    filename = unescape(filename)
    res.download(filepath, filename, err => {
      if (err) {
        console.log('下载出错', err)
      }
    })
})

// 删除所有文件
router.post('/deleteAllAchifile', controller.deleteAllAchifile);
// 删除单个文件
router.post('/deleteAchifile', controller.deleteAchifile);


// 筛选
router.post('/queryByFilter', controller.queryByFilter);





module.exports = router