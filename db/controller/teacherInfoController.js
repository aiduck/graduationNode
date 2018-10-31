const teacherInfoDao = require('../dao/teacherInfoDao')
const utils = require('../../util/utils')

// 批量导入用户信息
let insertUserList = async (req, res, next) => {
    let userArr = req.body;
    let values = [];
    let teavalues = [];
  
    if(userArr.constructor == Array) {
        userArr.map((item, index) => {
            let status;
           
            if(item.status === '可用') {
                status = '可用'
            } else {
                status = '不可用'
            }
            let value = [`${item.user_id}`,`${item.username}`,`123456`,`${item.email}`,`${item.telno}`,`${item.address}`,`教师`,`${status}`];
            let teaValue = [`${item.user_id}`,`${item.username}`,`${item.sex}`,`${item.job_title}`,`${item.education}`];
            values.push(value);
            teavalues.push(teaValue);
         
        })
    } else {
        let status;
        if(userArr.status === '可用') {
            status = '可用'
        } else {
            status = '不可用'
        }
        let value = [`${userArr.user_id}`,`${userArr.username}`,`123456`,`${userArr.email}`,`${userArr.telno}`,`${userArr.address}`,`教师`,`${status}`];
        let teaValue = [`${userArr.user_id}`,`${userArr.username}`,`${userArr.sex}`,`${userArr.job_title}`,`${userArr.education}`];
        values.push(value);
        teavalues.push(teaValue);
    }
    try {
        let  user = await teacherInfoDao.insertUserList(values,teavalues);
        console.log(user);
        if(user.code === 200) {
            res.send({
                code: 200,
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
        let user = await teacherInfoDao.queryLimitUser(startNum,size);
        let userNum = await teacherInfoDao.queryNum();
        console.log(user);
        console.log(userNum);
        if(user.code === 200) {
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
        let teacher =  await teacherInfoDao.query();
        console.log(teacher);
        if(teacher.code === 200) {
            let data = {
                userList: teacher.data
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
        let userPro = await teacherInfoDao.queryUserById(req.body.user_id);
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

// 班级信息中的获取教师姓名
let queryByIdForName = async(req, res, next) => {

    try {
        let userPro = await teacherInfoDao.queryByIdForName(req.body.user_id);
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
        let filterPro = await teacherInfoDao.queryByFilter(filter,startNum,size);
        console.log(filterPro)
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
        console.log(userPro);
        if(userPro.code === 200) {
            res.send({
                code: 200,
                // data: userPro.data,
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
    let teacherList = req.body.userList;

    try {
        let deletePro = await teacherInfoDao.daleteUserList(userList, teacherList);
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
    queryByIdForName,
    
    insertUserList,

    updateUserInfo,

    daleteUserList,
}
module.exports = controller