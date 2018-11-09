const projectInfoDao = require('../dao/projectInfoDao')
const utils = require('../../util/utils')

// 添加项目
let insterProject = async (req, res, next) => {
    // let courseArr = req.body;
    let project = req.body;
    let values = [];
    let status;
    let is_choose;
    if(project.status === '可用') {
        status = '可用'
    } else {
        status = '不可用'
    }
    if(project.is_choose === '可选') {
        is_choose = '可选'
    } else {
        is_choose = '不可选'
    }
    let value = [`${project.project_id}`,`${project.project_name}`,`${project.project_content}`,`${project.target}`,`${project.course_id}`,`${status}`,`${is_choose}`];
    values.push(value);
    try {
        let  projectPro = await projectInfoDao.insterProject(values);
        console.log(projectPro);
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: projectPro.data,
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

// 查询项目
let queryLimitProject = async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let projectPro = await projectInfoDao.queryLimitProject(startNum,size);
        console.log(projectPro);
        if(projectPro.code === 200) {
            let data = {
                projectList: projectPro.data,
                total: projectPro.number
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
let updateProjectStatus = async(req, res, next) => {
    try {
        let statusPro = await projectInfoDao.updateProjectStatus(req.body.status, req.body.project_id);
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
        let projectPro = await projectInfoDao.queryById(req.body.project_id);
        console.log(projectPro);
        if(projectPro.code === 200) {
            let data = {
                ...projectPro.data
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
let updateProjectInfo = async(req, res, next) => {
    let {
        project_name,
        project_content,
        target,
        course_id,
        project_id
    } = req.body.form;
    try {
        let projectPro = await projectInfoDao.updateProjectInfo(project_name,project_content,target,course_id,project_id);
        console.log(projectPro);
        if(projectPro.code === 200){
            res.send({
                code: 200,
                data: projectPro.data,
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
        let filterPro = await projectInfoDao.queryByFilter(filter,startNum,size);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                projectList: filterPro.data,
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

// 根据courseID查询project
let queryProByCourseID = async(req, res, next) => {
    try {
        let projectPro = await projectInfoDao.queryProByCourseID(req.body.course_id);
        console.log(projectPro);
        if(projectPro.code === 200) {
            let data = {
                projectIdList:projectPro.data
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

let queryByIdForName = async(req, res, next) => {

    try {
        let projectPro = await projectInfoDao.queryByIdForName(req.body.project_id);
        console.log(projectPro);
        if(projectPro.code === 200) {
            let data = {
                project: projectPro.data
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
    insterProject,
    queryLimitProject,
    updateProjectStatus,
    queryById,
    updateProjectInfo,
    queryByFilter,
    queryProByCourseID,
    queryByIdForName,
}
module.exports = controller