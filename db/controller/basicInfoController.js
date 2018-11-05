const basicInfoDao = require('../dao/basicInfoDao')
const utils = require('../../util/utils')

// 批量导入学院
let insterCollege = async (req, res, next) => {
    let collegeArr = req.body;
    let values = [];
    collegeArr.map((item, index) => {
        if(item.status === '可用') {
            status = '可用'
        } else {
            status = '不可用'
        }
        let value = [`${item.college_id}`,`${status}`];
        values.push(value);
    })
    try {
        let  college = await basicInfoDao.insertCollege(values);
        console.log(college)
        if(college.code === 200) {
            res.send({
                code: 200,
                data: college.data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}
// 批量导入专业
let insterMajor = async (req, res, next) => {
    let majorArr = req.body;
    let values = [];
    majorArr.map((item, index) => {
        if(item.status === '可用') {
            status = '可用'
        } else {
            status = '不可用'
        }
        let value = [`${item.major_id}`,`${item.college_id}`,`${status}`];
        values.push(value);
    })
    try {
        let  major = await basicInfoDao.insertMajor(values);
        console.log(major);
        if(major.code === 200) {
            res.send({
                code: 200,
                data: major.data,
                msg: 'success'
            });
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msgCode: err.results.sqlState,
          msg: err.message || err.msg
        })
    }
}
// 批量导入专业
let insterAdclass = async (req, res, next) => {
    let adclassArr = req.body;
    let values = [];
    adclassArr.map((item, index) => {
        let value = [`${item.aclass_id}`,`${item.major_id}`];
        values.push(value);
    })
    try {
        let  adclass = await basicInfoDao.insertAdclass(values);
        console.log(adclass)
        if(adclass.code === 200) {
            res.send({
                code: 200,
                data: adclass.data,
                msg: 'success'
            });
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
       
    }
    catch (err) {
        res.send({
          code: 500,
          msgCode: err.results.sqlState,
          msg: err.message || err.msg
        })
    }
}

// 查询所有学院信息
let queryCollege = async (req, res, next) => {
    try {
        let college = await basicInfoDao.queryCollege();
        console.log(college)
        var responseData = [];
        if(college.code === 200) {
            college.data.map((item, index) => {    
                responseData.push({
                    college_id: item.college_id,
                    status: item.status
                });
            });
        } 
        if(college.code === 200) {
            res.send({
                code: 200,
                data: responseData,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}
// 查询所有特定学院的所有专业信息
let queryMajor= async (req, res, next) => {
    let collegeId = req.body.collegeId;
    try {
        let major = await basicInfoDao.queryMajorById(collegeId);
        console.log(major)
        var responseData = [];
        if(major.code === 200) {
            major.data.map((item, index) => {   
                responseData.push({
                    major_id: item.major_id,
                    college_id: item.college_id,
                    status:item.status
                });
            });
        }
        if(major.code === 200) {
            res.send({
                code: 200,
                data: responseData,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
        
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}
// 查询所有特定专业的所有班级信息
let queryAdClass = async (req, res, next) => {
    let majorId = req.body.majorId;
    try {
        let classList = await basicInfoDao.queryAdClassById(majorId);
        console.log(classList)
        var responseData = [];
        if(classList.code === 200) {
            classList.data.map((item, index) => {     
                responseData.push({
                    aclass_id: item.aclass_id,
                    major_id:item.major_id
                });
            });
        }
        if(classList.code === 200) {
            res.send({
                code: 200,
                data: responseData,
                msg: 'success'
            })
        }  else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
        
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 启用禁用状态
let updateStatus = async (req, res, next) => {
    let type = req.body.type;
    let status = req.body.status;
    let item = req.body.item;
    try {
        let statusPro = await basicInfoDao.updateStatus(type, status, item);
        console.log(statusPro)
        if(statusPro.code === 200) {
            res.send({
                code: 200,
                data: statusPro.data,
                msg: 'update success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch(err) {
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 更新专业状态='可用' 前需要先查询学院的状态 = '可用'
let queryColSta = async (req, res, next) => {
    var collegeId = req.body.item.college_id;
    try {
        let statusPro = await basicInfoDao.queryColSta(collegeId);
        console.log(statusPro)
        if(statusPro.code === 200) {
            res.send({
                code: 200,
                data: statusPro.data[0].status,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
        
    }
    catch(err) {
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 删除班级
let delAdclass = async (req, res, next) => {


    var adclassObj = req.body.adclassObj;
    try {
        let adclassPro = await basicInfoDao.delAdclass(adclassObj);
        console.log(adclassPro)
        if(adclassPro.code === 200) {
            res.send({
                code: 200,
                data: adclassPro,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
        
    }
    catch(err) {
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 添加学院，专业，班级
let addBasicInfo = async (req, res, next) => {
    let type = req.body.type;
    let item = req.body.item;
    var value;
    if(type === 'college') {
        value = [`${item.college_id}`,`可用`];
    } else if(type === 'major') {
        value = [`${item.major_id}`,`${item.college_id}`,`可用`];
    } else if(type === 'adclass') {
        value = [`${item.aclass_id}`,`${item.major_id}`];
    }
    try {
        let addPro = await basicInfoDao.addBasicInfo(type, [value]);
        console.log(addPro);
        if(addPro.code === 200) {
            res.send({
                code: 200,
                data: addPro.data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
        
    }
    catch (err) {
        console.log(err);
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

let controller = {

    insterCollege,
    insterMajor,
    insterAdclass,

    queryCollege,
    queryMajor,
    queryAdClass,

    updateStatus,
    queryColSta,

    delAdclass,

    addBasicInfo
}
module.exports = controller