const projectScoreDao = require('../dao/projectScoreDao')
const utils = require('../../util/utils')



// 用户查询内容
let queryProjectScore =  async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let usertype = params.usertype;
    let user_id = params.user_id;


    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let scorePro = await projectScoreDao.queryProjectScore(user_id,usertype,startNum,size);
        if(scorePro.code === 200) {
            let data = {
                scoreList: scorePro.data,
                total: scorePro.number
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

// score详细内容
let queryProjectScoreDetail = async(req, res, next) => {
    let params = req.body;
    let team_id = params.team_id;
    let usertype = params.usertype;
    let user_id = params.user_id;

    try {
        let scorePro = await projectScoreDao.queryProjectScoreDetail(team_id,usertype,user_id);
        if(scorePro.code === 200) {
            res.send({
                code: 200,
                data: scorePro.data,
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

// 更新成绩
let updateScore = async(req, res, next) => {
    let params = req.body;
    let studentList = params.studentList;

    try {
        let scorePro = await projectScoreDao.updateScore(studentList);
        if(scorePro.code === 200) {
            res.send({
                code: 200,
                data: scorePro.data,
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
        let filterPro = await projectScoreDao.queryByFilter(filter,startNum,size);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                scoreList: filterPro.data,
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
    queryProjectScore,
    queryProjectScoreDetail,
    updateScore,
    queryByFilter
}
module.exports = controller