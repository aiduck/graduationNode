const basicInfoDao = require('../dao/basicInfoDao')
const utils = require('../../util/utils')


let queryCollege = async (req, res, next) => {
    try {
        let college = await basicInfoDao.queryCollege();
        console.log(college);
        var responseData = [];
        if(college.code === 200) {
            college.data.map((item, index) => {  
                if(item.status === 1) {
                    responseData.push({
                        college_id: item.college_id,
                        college_name: item.college_name,
                        status: item.status
                    });
                }
            });
            console.log(responseData)
        }
        res.send({
            code: 200,
            data: responseData,
            msg: 'success'
        })
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

let queryMajor= async (req, res, next) => {
    let academyId = req.body.academyId;
    console.log(academyId);
    try {
        let major = await academyescDao.queryMajorFromAca(academyId);
        var responseData = [];
        if(major.code === 200) {
            major.data.map((item, index) => {     
                responseData.push({
                    academy: item.academy,
                    major: item.major,
                    status:item.status
                });
            });
            console.log(responseData)
        }
        res.send({
            code: 200,
            data: responseData,
            msg: 'success'
        })
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

let queryAdClass = async (req, res, next) => {
    let classId = req.body.classId;
    console.log(classId);
    try {
        let classList = await academyescDao.queryClassFromMajor(classId);
        var responseData = [];
        if(classList.code === 200) {
            classList.data.map((item, index) => {     
                responseData.push({
                    major: item.major,
                    _class:item._class
                });
            });
            console.log(responseData)
        }
        res.send({
            code: 200,
            data: responseData,
            msg: 'success'
        })
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

let controller = {
    queryCollege,
    queryMajor,
    queryAdClass
}
module.exports = controller