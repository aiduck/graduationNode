const userInfoDao = require('../dao/userInfoDao')
const utils = require('../../util/utils')

// 批量导入用户信息
let insertUserList = async (req, res, next) => {
    let userArr = req.body;
    let values = [];
    let valuesOth = [];
    let valuesTea = [];
    let valuesStu = [];
    let user_type_name = '用户';
    // 对于用户基本操作已经没有导入功能了
    if(userArr.constructor == Array) {
        userArr.map((item, index) => {
            let status;
            if(item.status === '可用') {
                status = '可用'
            } else {
                status = '不可用'
            }
            let value = [`${item.user_id}`,`${item.username}`,`123456`,`${item.email}`,`${item.telno}`,`${item.address}`,`${item.user_type_name}`,`${status}`];
            let valueOth = [`${item.user_id}`,`${item.username}`];
            // 存入用户信息
            values.push(value);
            if(item.user_type_name === '教师') {
                valuesTea.push(valueOth);
            } else if(item.user_type_name === '学生') {
                valuesStu.push(valueOth);
            }
        })
    } else {
        // 插入单个用户的操作
        let status;
        if(userArr.status === '可用') {
            status = '可用'
        } else {
            status = '不可用'
        }
        let value = [`${userArr.user_id}`,`${userArr.username}`,`123456`,`${userArr.email}`,`${userArr.telno}`,`${userArr.address}`,`${userArr.user_type_name}`,`${status}`];
        let valueOth = [`${userArr.user_id}`,`${userArr.username}`];
        user_type_name = userArr.user_type_name;
        values.push(value);
        valuesOth.push(valueOth);
    }
    try {
        let user;
        if(user_type_name  === '用户') {
            user = await userInfoDao.insertUserListTeaStu(values,valuesTea,valuesStu);
        } else {
            user = await userInfoDao.insertUserListOth(values,valuesOth,user_type_name);
        }
        console.log(user);
        if(user.code === 200) {
            res.send({
                code: 200,
                data: user.data,
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
        // let data = {
        //     userList: user.data,
        //     total: userNum.data[0].number
        // }
        console.log(user);
        console.log(userNum);
        if(user.code === 200 && userNum.code === 200) {
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
// 根据id查个人用户信息
let queryUserById  =  async(req, res, next) => {
    try {
        let userPro = await userInfoDao.queryUserById(req.body.user_id);
        console.log(userPro);
        if(userPro.code === 200) {
            let data = {
                user: userPro.data
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

// 根据筛选条件筛选信息 obj2MySql
let queryByFilter = async(req, res, next) => {
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await userInfoDao.queryByFilter(filter,startNum,size);
        console.log(filterPro);
        if(filterPro.code === 200) {
            let data = {
                userList: filterPro.data,
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

// 更新用户状态
let updatedStatus = async(req, res, next) => {
    try {
        let statusPro = await userInfoDao.updatedStatus(req.body.status, req.body.user_id);
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
// 更新用户密码
let updatePwc = async(req, res, next) => {
    try {
        let pwdPro = await userInfoDao.updatePwc(req.body.user_id);
        console.log(pwdPro);
        if(pwdPro.code === 200) {
            res.send({
                code: 200,
                data: pwdPro.data,
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
        console.log(userPro);
        if(userPro.code === 200){
            res.send({
                code: 200,
                data: userPro.data,
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

// 删除用户信息
let daleteUserList = async(req, res, next) => {
    let userList = req.body.userList;
    let teacherList = req.body.teacherList;
    let studentList = req.body.studentList;

    try {
        let deletePro = await userInfoDao.daleteUserList(userList, teacherList, studentList);
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