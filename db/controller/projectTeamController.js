const projectTeamDao = require('../dao/projectTeamDao')
const utils = require('../../util/utils')

// 添加团队
let insterProjectTeam = async (req, res, next) => {
    let team = req.body;
    let values = [];
    let value = [`${team.team_id}`,`${team.team_name}`,`${team.class_id}`,`${team.user_id}`,`${team.project_id}`];
    values.push(value);
    try {
        let  teamPro = await projectTeamDao.insterProjectTeam(values);
        console.log(teamPro);
        if(teamPro.code === 200) {
            res.send({
                code: 200,
                data: teamPro.data,
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

// 查询团队
let queryLimitTeam = async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let teamPro = await projectTeamDao.queryLimitTeam(startNum,size);
        console.log(teamPro);
        if(teamPro.code === 200) {
            let data = {
                teamList: teamPro.data,
                total: teamPro.number
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

let deleteTeam = async(req, res, next) => {
    try {
        let  teamPro = await projectTeamDao.deleteTeam(req.body.team_id);
        console.log(teamPro);
        if(teamPro.code === 200) {
            res.send({
                code: 200,
                // data: teamPro.data,
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

// 筛选
let queryByFilter = async(req, res, next) =>{
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await projectTeamDao.queryByFilter(filter,startNum,size);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                teamList: filterPro.data,
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

// 查询特殊个体team，project，studentList，classes
let queryById = async(req, res, next) => {
    try {
        let teamPro = await projectTeamDao.queryById(req.body.team_id);
        console.log(teamPro);
        if(teamPro.code === 200) {
            let data = {
                ...teamPro.data
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

// 更新团队信息
let updateProjectTeamInfo = async(req, res, next) => {
    let {
        team_id,
        team_name,
        class_id,
        user_id,
        project_id,
    } = req.body.form;
    try {
        let teamPro = await projectTeamDao.updateProjectTeamInfo(team_name,class_id,user_id,project_id,team_id);
        console.log(teamPro);
        if(teamPro.code === 200){
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
// 插入团队成员
let insertTeamMember = async(req, res, next) => {
    try {
        let teamPro = await projectTeamDao.insertTeamMember(req.body.team_id,req.body.user_id);
        console.log(teamPro);
        if(teamPro.code === 200) {
            res.send({
                code: 200,
                data: teamPro.data,
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
// 删除团队成员
let deleteTeamMember = async(req, res, next) => {
    try {
        let teamPro = await projectTeamDao.deleteTeamMember(req.body.team_id,req.body.user_id);
        console.log(teamPro);
        if(teamPro.code === 200) {
            res.send({
                code: 200,
                data: teamPro.data,
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
    insterProjectTeam,
    queryLimitTeam,
    deleteTeam,
    queryByFilter,
    queryById,
    updateProjectTeamInfo,
    insertTeamMember,
    deleteTeamMember
}
module.exports = controller