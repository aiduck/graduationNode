const courseInfoDao = require('../dao/courseInfoDao')
const utils = require('../../util/utils')

// 添加课程
let insterCourse = async (req, res, next) => {
    // let courseArr = req.body;
    let course = req.body;
    let values = [];
    let status;
    if(course.status === '可用') {
        status = '可用'
    } else {
        status = '不可用'
    }
    let value = [`${course.course_id}`,`${course.course_name}`,`${course.year}`,`${course.term}`,`${course.hours}`,`${course.grade}`,
    `${course.college_id}`,`${course.major_id}`,`${course.ratio_usual}`,`${course.ratio_project}`,`${status}`];
    values.push(value);
    try {
        let  course = await courseInfoDao.insterCourse(values);
        console.log(course);
        if(course.code === 200) {
            res.send({
                code: 200,
                data: course.data,
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

// 查询课程
let queryLimitCourse = async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let couser = await courseInfoDao.queryLimitCourse(startNum,size);
        console.log(couser);
        if(couser.code === 200) {
            let data = {
                courseList: couser.data,
                total: couser.number
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

// 更改状态
let updateCourseStatus = async(req, res, next) => {
    try {
        let statusPro = await courseInfoDao.updateCourseStatus(req.body.status, req.body.course_id);
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
// 筛选
let queryByFilter = async(req, res, next) =>{
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await courseInfoDao.queryByFilter(filter,startNum,size);
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

// 查询特殊课程
let queryCourseById = async(req, res, next) => {
    try {
        let coursePro = await courseInfoDao.queryCourseById(req.body.course_id);
        console.log(coursePro);
        if(coursePro.code === 200) {
            let data = {
                course: coursePro.data
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
//  班级信息中的获取课程名称
let queryByIdForName = async(req, res, next) => {
    try {
        let coursePro = await courseInfoDao.queryByIdForName(req.body.course_id);
        console.log(coursePro);
        if(coursePro.code === 200) {
            let data = {
                course: coursePro.data
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

let updateCourseInfo = async(req, res, next) => {
    let {
        course_id,
        course_name,
        year,
        term,
        hours,
        grade,
        college_id,
        major_id,
        ratio_usual,
        ratio_project,
    } = req.body.form;
    try {
        let coursePro = await courseInfoDao.updateCourseInfo(course_name,year,term,hours,grade,college_id,major_id,ratio_usual,ratio_project,course_id);
        console.log(coursePro);
        if(coursePro.code === 200){
            res.send({
                code: 200,
                data: coursePro.data,
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

// 删除用户信息
let daleteCourseList = async(req, res, next) => {
    let courseIdList = req.body.courseIdList;
    try {
        let deletePro = await courseInfoDao.daleteCourseList(courseIdList);
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

// 获取所有课程信息
let queryAll = async(req, res, next) => {
    try {
        let queryAllPro = await courseInfoDao.queryAll();
        console.log(queryAllPro);
        let courseList = {
            courseList: queryAllPro.data
        }
        if(queryAllPro.code === 200) {
            res.send({
                code: 200,
                data: courseList,
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

    insterCourse,
    queryLimitCourse,
    updateCourseStatus,
    queryByFilter,
    queryCourseById,
    updateCourseInfo,
    daleteCourseList,
    queryByIdForName,
    queryAll
}
module.exports = controller