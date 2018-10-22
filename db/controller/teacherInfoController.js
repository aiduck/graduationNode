const teacherInfoDao = require('../dao/teacherInfoDao')
const utils = require('../../util/utils')

// 批量导入用户信息
let insertUserList = async (req, res, next) => {
    let userArr = req.body;
    let values = [];
    let teavalues = [];
  
    if(userArr.constructor == Array) {
        userArr.map((item, index) => {
            let value = [`${item.user_id}`,`${item.username}`,`${item.password}`,`${item.email}`,`${item.telno}`,`${item.address}`,`${item.user_type_name}`,`${item.status}`];
            let teaValue = [`${item.user_id}`,`${item.username}`,`${item.sex}`,`${item.job_title}`,`${item.education}`];
            values.push(value);
            teavalues.push(teaValue);
         
        })
    } else {
        let value = [`${userArr.user_id}`,`${userArr.username}`,`123456`,`${userArr.email}`,`${userArr.telno}`,`${userArr.address}`,`教师`,`${userArr.status}`];
        let teaValue = [`${userArr.user_id}`,`${userArr.username}`,`${userArr.sex}`,`${userArr.job_title}`,`${userArr.education}`];
        values.push(value);
        teavalues.push(teaValue);


    }
    try {
        let  user = await teacherInfoDao.insertUserList(values,teavalues);
        res.send({
            code: 200,
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


// 查询规定范围的用户信息
let queryLimitUser = async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let user = await teacherInfoDao.queryLimitUser(startNum,size);
        let userNum = await teacherInfoDao.queryNum();
        let data = {
            userList: user.data,
            total: userNum.data[0].number
        }
        res.send({
            code: 200,
            data: data,
            msg: 'success'
        })
    }
    catch (err) {
        console.log(err);
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}


// 查询所有用户信息（导出）
let queryUser =  async(req, res, next) => {
    try {
        let teacher =  await teacherInfoDao.query();
        let data = {
            userList: teacher.data
        }
        res.send({
            code: 200,
            data: data,
            msg: 'success'
        })
    }
    catch (err) {
        console.log(err);
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 根据id查个人用户信息
let queryUserById  =  async(req, res, next) => {
    try {
        let userPro = await teacherInfoDao.queryUserById(req.body.user_id);
        let data = {
            user: userPro.data
        }
        res.send({
            code: 200,
            data: data,
            msg: 'success'
        })
    }
    catch(err) {
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 根据筛选条件筛选信息 obj2MySql
let queryByFilter = async(req, res, next) => {

    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await teacherInfoDao.queryByFilter(filter,startNum,size);
        let data = {
            userList: filterPro.data
        }
        res.send({
            code: 200,
            data: data,
            msg: 'success'
        })
    }
    catch(err) {
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}


// 更新用户信息
let updateUserInfo = async(req, res, next) => {
    let {
        username,
        email, 
        telno, 
        address, 
        user_type_name, 
        sex,
        job_title,
        education,
        user_id,
    } = req.body.userForm;
    try {
        let userPro = await teacherInfoDao.updateUserInfo(username,email,telno,address,user_type_name,sex,job_title,education,user_id);
        res.send({
            code: 200,
            // data: userPro.data,
            msg: 'success'
        })
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
let daleteUserList = async(req, res, next) => {
    
    let userList = req.body.userList;
    let teacherList = req.body.userList;

    try {
        let deletePro = await teacherInfoDao.daleteUserList(userList, teacherList);
        res.send({
            code: 200,
            msg: 'success'
        })
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
    queryLimitUser,
    queryUser,
    queryUserById,
    queryByFilter,

    insertUserList,

    updateUserInfo,

    daleteUserList,
}
module.exports = controller