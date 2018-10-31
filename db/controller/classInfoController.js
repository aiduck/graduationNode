const classInfoDao = require('../dao/classInfoDao')
const utils = require('../../util/utils')

// 添加教学班级
let insterClass = async (req, res, next) => {
    // let courseArr = req.body;
    let _class = req.body;
    console.log(_class);
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
    // let course_id = params.course_id;
    // let user_id = params.user_id;



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

    insterClass,
    queryLimitClass,
    updateClassStatus,
    queryById,
    updateClassInfo,
    queryByFilter,
    daleteClassList
}
module.exports = controller