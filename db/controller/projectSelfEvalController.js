const projectSelfEvalDao = require('../dao/projectSelfEvalDao')
const utils = require('../../util/utils')

// 添加记录前查询是否小组成员已经添加了信息
let querySelfByProId = async (req, res, next) => {
    let project_id = req.body.project_id;
    console.log(project_id);
    try {
        let  projectSelfPro = await projectSelfEvalDao.querySelfByProId(project_id);
        if(projectSelfPro.code === 200) {
            if(projectSelfPro.data) {
                res.send({
                    code: 200,
                    data: projectSelfPro.data,
                    msg: 'success'
                })
            } else {
                res.send({
                    code: 200,
                    data: [],
                    msg: 'success'
                })
            }
            
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

// 添加项目日报
let inster = async (req, res, next) => {
    let projectSelf = req.body;
    let values = [];
    let id = utils.getId('selfId');
    let value = [`${id}`,`${projectSelf.tasks}`,
    `${projectSelf.workload}`,`${projectSelf.assessment}`,
    `${projectSelf.score}`,`${projectSelf.date}`,
    `${projectSelf.time}`,`${projectSelf.user_id}`,
    `${projectSelf.project_id}`];
    values.push(value);
    try {
        let  projectPro = await projectSelfEvalDao.insterProjectSelfEval(values);
        if(projectPro.code === 200) {
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

// 用户查询内容
let querySelf =  async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let usertype = params.usertype;
    let user_id = params.user_id;
    let sub_time = params.sub_time;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let selfPro = await projectSelfEvalDao.querySelfEval(user_id,usertype,startNum,size,sub_time);
        if(selfPro.code === 200) {
            let data = {
                selfList: selfPro.data,
                total: selfPro.number
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

// 删除自评
let deleteSelf = async (req, res, next) => {
    let id = req.body.id;
    try {
        let  projectSelfPro = await projectSelfEvalDao.deleteSelf(id);
        if(projectSelfPro.code === 200) {
            res.send({
                code: 200,
                data: [],
                msg: 'success'
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

// 通过日报id查询具体信息
let querySelfById = async (req, res, next) => {
    let id = req.body.id;
    try {
        let  projectPro = await projectSelfEvalDao.querySelfById(id);
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

// 更新操作
let updataSelf = async(req,res,next) => {
    let form = req.body.form;
    let {
        tasks,
        workload,
        assessment,
        score, 
        date, 
        time,
        id
    } = form;
    try {
        let  projectPro = await projectSelfEvalDao.updataSelf(tasks,workload,assessment,score, date, time,id);
        if(projectPro.code === 200) {
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

// 筛选操作
let queryByFilter = async(req, res, next) => {
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await projectSelfEvalDao.queryByFilter(filter,startNum,size);
        if(filterPro.code === 200) {
            let data = {
                selfList: filterPro.data,
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
    querySelfByProId,
    querySelf,
    deleteSelf,
    querySelfById,
    updataSelf,
    queryByFilter
}
module.exports = controller