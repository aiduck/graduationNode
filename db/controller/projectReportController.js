const projectReportDao = require('../dao/projectReportDao')
const utils = require('../../util/utils')

// 添加项目日报
let inster = async (req, res, next) => {
    let projectReport = req.body;
    let values = [];
    let report_id = utils.getId('reportId');

    let value = [`${report_id}`,`${projectReport.report_date}`,
    `${projectReport.report_time}`,`${projectReport.report_work}`,
    `${projectReport.report_problem}`,`${projectReport.report_plan}`,
    `${projectReport.report_status}`,`${projectReport.report_comment}`,
    `${projectReport.project_id}`,`${projectReport.user_id}`];
    values.push(value);
    try {
        let  projectReportPro = await projectReportDao.insterProjectReport(values);
        if(projectReportPro.code === 200) {
            res.send({
                code: 200,
                data: '',
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

// 检查用户信息
// 检查输入的用户ID以及登录的用户信息是否相符，相符返回该用户参与的项目ID
let checkUserIdAndRetPro = async(req, res, next) => {
    let user = req.body;
    try {
        let  dao = await projectReportDao.checkUserIdAndRetPro(user.user_id,user.username,user.sub_time);
        if(dao.code === 200) {
            res.send({
                code: 200,
                data: dao.data,
                msg: 'success'
            })
        } else if(dao.code === 401) {
            res.send({
                code: 401,
                msg: '输入的用户ID是否正确'
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

// 用户查询内容
let queryReport =  async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let usertype = params.usertype;
    let user_id = params.user_id;
    let sub_time = params.sub_time;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let reportPro = await projectReportDao.queryReport(user_id,usertype,startNum,size,sub_time);
        if(reportPro.code === 200) {
            let data = {
                reportList: reportPro.data,
                total: reportPro.number
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

// 通过日报id查询具体信息
let queryReportById = async (req, res, next) => {
    let projectReport = req.body;
    let report_id = projectReport.report_id;
    try {
        let  projectReportPro = await projectReportDao.queryReportById(report_id);
        console.log(projectReportPro)
        if(projectReportPro.code === 200) {
            res.send({
                code: 200,
                data: projectReportPro.data,
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

// 通过日报id更新日报信息
let updateReport =  async (req, res, next) => {
    let projectReport = req.body.form;
    let usertype = req.body.usertype;
    try {
        let  projectReportPro = await projectReportDao.updateReport(usertype,projectReport.report_id,projectReport.report_date,
            projectReport.report_time,projectReport.report_work,projectReport.report_problem,
            projectReport.report_plan,projectReport.report_status,projectReport.report_comment);
        if(projectReportPro.code === 200) {
            res.send({
                code: 200,
                data: [],
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

// 删除
let deleteReport =  async (req, res, next) => {
    let report_id = req.body.report_id;
    try {
        let  projectReportPro = await projectReportDao.deleteReport(report_id);
        if(projectReportPro.code === 200) {
            res.send({
                code: 200,
                data: [],
                msg: 'success'
            })
        } else if(projectReportPro.code === 202){
            res.send({
                code: 202,
                msg: '不能删除已审核的文章'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作错误'
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

// 筛选
let queryByFilter = async(req, res, next) => {
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await projectReportDao.queryByFilter(filter,startNum,size);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                reportList: filterPro.data,
                total:  filterPro.total
            }
            res.send({
                code: 200,
                data: data,
                msg: 'success'
            });
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
    inster,
    checkUserIdAndRetPro,
    queryReport,
    queryReportById,
    updateReport,
    deleteReport,
    queryByFilter
}
module.exports = controller