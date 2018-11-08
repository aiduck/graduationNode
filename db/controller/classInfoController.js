const classInfoDao = require('../dao/classInfoDao')
const utils = require('../../util/utils')

// 添加教学班级
let insterClass = async (req, res, next) => {
    let _class = req.body;
    let values = [];
    let status;
    if(_class.status === '可用') {
        status = '可用'
    } else {
        status = '不可用'
    }
    let value = [`${_class.class_id}`,`${_class.class_name}`,`${_class.course_id}`,`${_class.user_id}`,`${status}`];
    values.push(value);
    try {
        let  classPro = await classInfoDao.insterClass(values);
        console.log(classPro);
        if(classPro.code === 200) {
            res.send({
                code: 200,
                data: classPro.data,
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

// 查询教学班级
let queryLimitClass = async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let classPro = await classInfoDao.queryLimitClass(startNum,size);
        console.log(classPro);
        if(classPro.code === 200) {
            let data = {
                classList: classPro.data,
                total: classPro.number
            }
            res.send({
                code: 200,
                data: data,
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

// 更新状态
let updateClassStatus = async(req, res, next) => {
    try {
        let statusPro = await classInfoDao.updateClassStatus(req.body.status, req.body.class_id);
        console.log(statusPro);
        if(statusPro.code === 200) {
            res.send({
                code: 200,
                data: statusPro.data,
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

// 查询特殊个体
let queryById = async(req, res, next) => {
    try {
        let classPro = await classInfoDao.queryById(req.body.class_id);
        console.log(classPro);
        if(classPro.code === 200) {
            let data = {
                ...classPro.data
            }
            res.send({
                code: 200,
                data: data,
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
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 更新个体
let updateClassInfo = async(req, res, next) => {
    let {
        class_id,
        class_name,
        course_id,
        user_id
    } = req.body.form;
    try {
        let classPro = await classInfoDao.updateClassInfo(class_name,course_id,user_id,class_id);
        console.log(classPro);
        if(classPro.code === 200){
            res.send({
                code: 200,
                data: classPro.data,
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

// 筛选
let queryByFilter = async(req, res, next) => {
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await classInfoDao.queryByFilter(filter,startNum,size);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                courseList: filterPro.data,
                total:  filterPro.total
            }
            res.send({
                code: 200,
                data: data,
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
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}
// 删除
let daleteClassList = async(req, res, next) => {
    let classIdList = req.body.classIdList;
    try {
        let deletePro = await classInfoDao.daleteClassList(classIdList);
        console.log(deletePro);
        if(deletePro.code === 200) {
            res.send({
                code: 200,
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

// 批量插入班级成员
let insterClassMemeber = async(req, res, next) => {
    let _classMemeber = req.body;
    let values = [];
    // _classMemeber.map((item) => {
    //     let value = [`${item.user_id}`,`${item.username}`,`${item.class_id}`,`${item.class_name}`];
    //     values.push(value);
    // })
    if(_classMemeber.constructor == Array) {
        _classMemeber.map((item) => {
            let value = [`${item.user_id}`,`${item.username}`,`${item.class_id}`,`${item.class_name}`];
            values.push(value);
        });
    } else {
        let value = [`${_classMemeber.user_id}`,`${_classMemeber.username}`,`${_classMemeber.class_id}`,`${_classMemeber.class_name}`];
        values.push(value);

    }
    try {
        let  classMemeberPro = await classInfoDao.insterClassMemeber(values);
        console.log(classMemeberPro);
        if(classMemeberPro.code === 200) {
            res.send({
                code: 200,
                data: classMemeberPro.data,
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

// limit查询班级成员
let queryLimitClassMemeber = async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let classMemberPro = await classInfoDao.queryLimitClassMemeber(startNum,size);
        console.log(classMemberPro);
        if(classMemberPro.code === 200) {
            let data = {
                classList: classMemberPro.data,
                total: classMemberPro.number
            }
            res.send({
                code: 200,
                data: data,
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

// 筛选班级成员
let queryByFilterMemeber = async(req, res, next) => {
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await classInfoDao.queryByFilterMemeber(filter,startNum,size);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                classMemeberList: filterPro.data,
                total:  filterPro.total
            }
            res.send({
                code: 200,
                data: data,
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
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 删除班级成员信息
let daleteClassMemeberList = async(req, res, next) => {
    let classIdList = req.body.classIdList;
    try {
        let deletePro = await classInfoDao.daleteClassMemeberList(classIdList);
        console.log(deletePro);
        if(deletePro.code === 200) {
            res.send({
                code: 200,
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

// 导出班级成员
let queryAllClassMemeber = async(req, res, next) => {
    try {
        let user =  await classInfoDao.queryAllClassMemeber();
        console.log(user);
        if(user.code === 200) {
            let data = {
                userList: user.data
            }
            res.send({
                code: 200,
                data: data,
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

// 筛选导出班级成员
let queryAllClassMemeberFilter = async(req, res, next) => {
    let filter = req.body.filter;
    try {
        let filterPro = await classInfoDao.queryAllClassMemeberFilter(filter);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                classMemeberList: filterPro.data,
            }
            res.send({
                code: 200,
                data: data,
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
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 获取所有教学班级信息
let queryAll = async(req, res, next) => {
    try {
        let queryAllPro = await classInfoDao.queryAll();
        console.log(queryAllPro);
        let classList = {
            classList: queryAllPro.data
        }
        if(queryAllPro.code === 200) {
            res.send({
                code: 200,
                data: classList,
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

//  班级信息中的获取课程名称
let queryByIdForName = async(req, res, next) => {
    try {
        let classPro = await classInfoDao.queryByIdForName(req.body.class_id);
        console.log(classPro);
        if(classPro.code === 200) {
            let data = {
                classes: classPro.data
            }
            res.send({
                code: 200,
                data: data,
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
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

let queryStuByClassId = async(req, res, next) => {
    try {
        let classMemberPro = await classInfoDao.queryStuByClassId(req.body.class_id);
        console.log(classMemberPro);
        if(classMemberPro.code === 200) {
            let data = {
                studentId: classMemberPro.data
            }
            res.send({
                code: 200,
                data: data,
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
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}
let controller = {

    insterClass,
    queryLimitClass,
    updateClassStatus,
    queryById,
    updateClassInfo,
    queryByFilter,
    daleteClassList,

    insterClassMemeber,
    queryLimitClassMemeber,
    queryByFilterMemeber,
    daleteClassMemeberList,
    queryAllClassMemeber,
    queryAllClassMemeberFilter,

    queryAll,
    queryByIdForName,
    queryStuByClassId
}
module.exports = controller