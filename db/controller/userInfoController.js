const userInfoDao = require('../dao/userInfoDao')
const utils = require('../../util/utils')

// 批量导入用户信息
let insertUserList = async (req, res, next) => {
    let userArr = req.body;
    let values = [];
    if(userArr.constructor == Array) {
        userArr.map((item, index) => {
            let value = [`${item.user_id}`,`${item.username}`,`${item.password}`,`${item.email}`,`${item.telno}`,`${item.address}`,`${item.user_type_name}`,`${item.status}`];
            values.push(value);
        })
    } else {
        let value = [`${userArr.user_id}`,`${userArr.username}`,`${userArr.password}`,`${userArr.email}`,`${userArr.telno}`,`${userArr.address}`,`${userArr.user_type_name}`,`${userArr.status}`];
        values.push(value);
    }
    console.log(values);
    try {
        let  user = await userInfoDao.insertUserList(values);
        res.send({
            code: 200,
            data: user.data,
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
        let user = await userInfoDao.queryLimitUser(startNum,size);
        let userNum = await userInfoDao.queryNum();
        // console.log(userNum)
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
        let user = await userInfoDao.query();
        let data = {
            userList: user.data
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
    // console.log(req.body.userId);
    try {
        let userPro = await userInfoDao.queryUserById(req.body.user_id);
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
    // console.log(req.body.filter);
    let filter = req.body.filter;
    try {
        let filterPro = await userInfoDao.queryByFilter(filter);
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

// 更新用户状态
let updatedStatus = async(req, res, next) => {
    try {
        let statusPro = await userInfoDao.updatedStatus(req.body.status, req.body.user_id);
        res.send({
            code: 200,
            data: statusPro.data,
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
// 更新用户密码
let updatePwc = async(req, res, next) => {
    try {
        let pwdPro = await userInfoDao.updatePwc(req.body.user_id);
        res.send({
            code: 200,
            data: pwdPro.data,
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
// 更新用户信息
let updateUserInfo = async(req, res, next) => {
    let {
        username,
        email, 
        telno, 
        address, 
        user_type_name, 
        user_id
    } = req.body.userForm;
    try {
        let userPro = await userInfoDao.updateUserInfo(username,email,telno,address,user_type_name,user_id);
        res.send({
            code: 200,
            data: userPro.data,
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
    try {
        let deletePro = await userInfoDao.daleteUserList(req.body.userList);
        res.send({
            code: 200,
            data: deletePro.data,
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

    updatedStatus,
    updatePwc,
    updateUserInfo,

    daleteUserList,
}
module.exports = controller