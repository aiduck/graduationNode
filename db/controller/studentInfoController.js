const studentInfoDao = require('../dao/studentInfoDao')
const utils = require('../../util/utils')

// 批量导入用户信息
let insertUserList = async (req, res, next) => {
    let userArr = req.body;
    let values = [];
    let stuvalues = [];
    if(userArr.constructor == Array) {
        userArr.map((item, index) => {
            let value = [`${item.user_id}`,`${item.username}`,`${item.password}`,`${item.email}`,`${item.telno}`,`${item.address}`,`${item.user_type_name}`,`${item.status}`];
            let stuValue = [`${item.user_id}`,`${item.username}`,`${item.college_id}`,`${item.major_id}`,`${item.aclass_id}`];
            values.push(value);
            stuvalues.push(stuValue);
        })
    } else {
        let value = [`${userArr.user_id}`,`${userArr.username}`,`123456`,`${userArr.email}`,`${userArr.telno}`,`${userArr.address}`,`学生`,`${userArr.status}`];
        let stuValue = [`${userArr.user_id}`,`${userArr.username}`,`${userArr.college_id}`,`${userArr.major_id}`,`${userArr.aclass_id}`];
        values.push(value);
        stuvalues.push(stuValue);

    }
    try {
        let  user = await studentInfoDao.insertUserList(values,stuvalues);
        console.log(user)
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
        let user = await studentInfoDao.queryLimitUser(startNum,size);
        let userNum = await studentInfoDao.queryNum();
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
        let teacher =  await studentInfoDao.query();
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
        let userPro = await studentInfoDao.queryUserById(req.body.user_id);
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
        let filterPro = await studentInfoDao.queryByFilter(filter,startNum,size);
        console.log(filterPro)
        if(filterPro.code === 200){
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
        college_id,
        major_id,
        aclass_id,
        user_id,
    } = req.body.userForm;
    try {
        let userPro = await studentInfoDao.updateUserInfo(username,email,telno,address,user_type_name,college_id,major_id,aclass_id,user_id);
        console.log(userPro)
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
    let studentList = req.body.userList;

    try {
        let deletePro = await studentInfoDao.daleteUserList(userList, studentList);
        console.log(deletePro)
        if(deletePro.code) {
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

    updateUserInfo,

    daleteUserList,
}
module.exports = controller