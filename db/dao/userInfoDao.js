const queryHelper = require('../../util/DBQuery');
const db = require('../../util/DBConfig');
const SQL = require('../sql/userInfoSQL');
const ProjectSQL = require('../sql/projectInfoSQL');
const ProjectAchiSQL = require('../sql/projectAchiSQL');

const util = require('../../util/utils')

/**
 * 用户登录
 * @param {*用户id} username 
 * @param {*用户密码} password 
 */
let login = (username, password) => {
    let sql = SQL.UserSQL.login;
    return queryHelper.queryPromise(sql, [username, password]);
}
/**
 * 查询固定范围的用户信息
 * @param {*limit start} startNum 
 * @param {*limit size} size 
 */
let queryLimitUser = (startNum, size) => {
    let sql = SQL.UserSQL.queryLimit;
    return queryHelper.queryPromise(sql, [startNum, size]);
}
/**
 * 查询用户信息数量
 */
let queryNum = () => {
    let sql = SQL.UserSQL.queryNum;
    return queryHelper.queryPromise(sql, null);
}
/**
 * 查询所有用户信息导出excel
 */
let query = () => {
    let sql = SQL.UserSQL.query;
    return queryHelper.queryPromise(sql, null);
}
/**
 * 查询个人用户信息
 * @param {*用户id} userId
 */
let queryUserById = (userId) => {
    let sql = SQL.UserSQL.queryById;
    return queryHelper.queryPromise(sql, userId);
}

let queryByFilter = (filter,startNum,size) => {
   
    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    let strBase = 'select user_id, username, email, telno, address, user_type_name, status from userInfo where ';
                    strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                    let res1 = await queryHelper.queryPromise(strBase, null,connection);
                    
                    let strBase2 = 'select count(*) as number from userInfo where ';
                    strBase2 = strBase2 + util.obj2MySql(filter);
                    let res2 = await queryHelper.queryPromise(strBase2, null,connection);
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '筛选成功',
                        data: res1.data,
                        total:  res2.data[0].number,
                    })
                }
                catch (err) {
                    console.log('出错了，准备回滚', err)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        err: err,
                        msg: '数据库操作失败'
                    })
                }
            }
        })
    })
}

/**
 * 更新用户状态
 * @param {*状态} status 
 * @param {*用户id} id 
 */
let updatedStatus = (status, id) => {
    let sql = SQL.UserSQL.updatedStatus;
    return queryHelper.queryPromise(sql, [status, id]);
}
/**
 * 更新密码
 * @param {*用户id} id 
 */
let updatePwc = (id) => {
    let sql = SQL.UserSQL.updatePwc;
    return queryHelper.queryPromise(sql, id);
}

/**
 * 更新用户个人信息（包括老师和学生的用户姓名）
 * @param {*用户姓名} username 
 * @param {*用户邮箱} email 
 * @param {*用户电话} telno 
 * @param {*用户地址} address 
 * @param {*用户类型} user_type_name 
 * @param {*用户id} user_id 
 */
let updateUserInfo = (username,email,telno,address,user_type_name,user_id) => {
    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    let sql1 = SQL.UserSQL.updateUserInfo;
                    let res1 = await queryHelper.queryPromise(sql1, [username, email, telno, address, user_type_name, user_id],connection);
                    if(user_type_name === '教师')  {
                        let sql2 = SQL.UserSQL.updateTeaName;
                        let res2 = await queryHelper.queryPromise(sql2, [username, user_id],connection);
                    } else  if(user_type_name === '学生'){
                        let sql3 = SQL.UserSQL.updateStuName;
                        let res3 = await queryHelper.queryPromise(sql3, [username, user_id],connection);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '更改用户信息成功'
                    })
                }
                catch (err) {
                    console.log('出错了，准备回滚', err)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        err: err,
                        msg: '数据库操作失败'
                    })
                }
            }
        })
    })
}

/**
 * 插入单个用户基本信息
 * @param {*数组用户} values
 * @param {*数组学生或者教师} valuesOth
 */
let insertUserListOth = (values, valuesOth, user_type_name) => {
  
    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    // 插入用户信息
                    let sql = SQL.UserSQL.insert;
                    let res1 = await queryHelper.queryPromise(sql, [values],connection);
                    if(user_type_name === '教师')  {
                        // 插入教师信息
                        let sqltea = SQL.UserSQL.insertTea;
                        let res2 = await queryHelper.queryPromise(sqltea, [valuesOth],connection);
                    } else  if(user_type_name === '学生'){
                        // 插入学生信息
                        let sqlstu = SQL.UserSQL.insertStu;
                        let res3 = await queryHelper.queryPromise(sqlstu, [valuesOth],connection);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '插入用户信息成功'
                    })
                }
                catch (err) {
                    console.log('出错了，准备回滚', err)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        err: err,
                        msg: '数据库操作失败'
                    })
                }
            }
        })
    })
}

/**
 * 批量插入用户基本信息
 * @param {*用户数组} values 
 * @param {*教师数组} valuesTea
 * @param {*学生数组} valuesStu 
 *  
 */
let insertUserListTeaStu = (values, valuesTea, valuesStu) => {
    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    // 插入用户信息
                    let sql = SQL.UserSQL.insert;
                    let res1 = await queryHelper.queryPromise(sql, [values],connection);
                    // 插入教师信息
                    if(valuesTea.length > 0) {
                        let sqltea = SQL.UserSQL.insertTea;
                        let res2 = await queryHelper.queryPromise(sqltea, [valuesTea],connection);
                    }
                    if(valuesStu.length > 0) {
                        // 插入学生信息
                        let sqlstu = SQL.UserSQL.insertStu;
                        let res3 = await queryHelper.queryPromise(sqlstu, [valuesStu],connection);
                    }
                    console.log(res1)
                    // console.log(res2)
                    // console.log(res3)
                    
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '批量插入用户信息成功',
                        data: res1,
                    })
                }
                catch (err) {
                    console.log('出错了，准备回滚', err)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        err: err,
                        msg: '数据库操作失败'
                    })
                }
            }
        })
    })
}
/**
 * 批量删除用户信息
 * @param {*用户id列表} userList 
 * @param {*教师id列表} teacherList 
 * @param {*学生id列表} studentList
 */
let daleteUserList = (userList, teacherList, studentList) => {

    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    let res1;
                    let res2;
                    let res3;
                    let sqlBase;
                    let sqlBaseTea;
                    let sqlBaseStu;
                    // 删除用户信息
                    if(userList.length > 0) {
                        sqlBase = `delete from userInfo where user_id in (`;
                        userList.map((item, index) => {
                            if(index < userList.length - 1) {
                                sqlBase = sqlBase +'\'' +item + '\','
                            } else {
                                sqlBase = sqlBase + '\''+ item + '\');'
                            }
                        })
                        res1 = await queryHelper.queryPromise(sqlBase, null,connection);
                    }
                    // 删除教师信息
                    if(teacherList.length > 0) {
                        sqlBaseTea = `delete from teacher where user_id in (`;
                        teacherList.map((item, index) => {
                            if(index < teacherList.length - 1) {
                                sqlBaseTea = sqlBaseTea +'\'' +item + '\','
                            } else {
                                sqlBaseTea = sqlBaseTea + '\''+ item + '\');'
                            }
                        })
                        res2 = await queryHelper.queryPromise(sqlBaseTea, null,connection);
                    }
                    if(studentList > 0) {
                        // 删除学生信息
                        sqlBaseStu = `delete from student where user_id in (`;
                        studentList.map((item, index) => {
                            if(index < studentList.length - 1) {
                                sqlBaseStu = sqlBaseStu +'\'' +item + '\','
                            } else {
                                sqlBaseStu = sqlBaseStu + '\''+ item + '\');'
                            }
                        })
                        res3 = await queryHelper.queryPromise(sqlBaseStu, null,connection);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '批量删除用户信息成功'
                    })
                }
                catch (err) {
                    console.log('出错了，准备回滚', err)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        err: err,
                        msg: '数据库操作失败'
                    })
                }
            }
        })
    })
}



/**
 * 导出筛选
 * @param {*} filter 
 */
let queryAllFilter = (filter) => {
    let strBase = 'select * from userInfo where ';
    strBase = strBase + util.obj2MySql(filter);
    return queryHelper.queryPromise(strBase, null);
}
/**
 * 上传用户头像
 * @param {*} user_id 
 * @param {*} filename 
 */
let saveUserImgfile = (user_id,filename) => {
    let sql = SQL.UserSQL.saveUserImgfile; 
    return queryHelper.queryPromise(sql, [filename,user_id]);
}

/**
 * 个人中心查找用户信息
 * @param {*} user_id 
 * @param {*} usertype 
 */
let queryByIdForTeaStu = (user_id,usertype) => {
    let sql;
    if(usertype === '学生') {
        sql = SQL.UserSQL.queryByIdForStu; 
    } else  if(usertype === '教师') {
        sql = SQL.UserSQL.queryByIdForTea; 
    } else {
        sql = SQL.UserSQL.queryByIdPwd; 
    }
    return queryHelper.queryPromise(sql, [user_id]);
}

/**
 * 个人中心更新用户信息
 * @param {*} userObj 
 * @param {*} user_id 
 * @param {*} usertype 
 */

let updateByIdForTeaStu = (userObj,user_id,usertype) => {
    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    let str1;
                    let res1;
                    let str2;
                    let res2;

                    let {
                        username,
                        email,
                        telno,
                        address,
                        password,
                        sex,
                        job_title,
                        education,
                        college_id,
                        major_id,
                        aclass_id,
                    } = userObj
                    str1 =  SQL.UserSQL.updateUser;
                    res1 = await queryHelper.queryPromise(str1,  [username,email,telno,address,password,user_id],connection);

                    if(usertype === '教师')  {
                        str2 = SQL.UserSQL.updateUserTea;
                        res2 = await queryHelper.queryPromise(str2,  [sex,job_title,education,user_id],connection);

                    } else  if(usertype === '学生'){
                        str2 = SQL.UserSQL.updateUserStu;
                        res2 = await queryHelper.queryPromise(str2,  [college_id,major_id,aclass_id,user_id],connection);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '插入用户信息成功'
                    })
                }
                catch (err) {
                    console.log('出错了，准备回滚', err)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        err: err,
                        msg: '数据库操作失败'
                    })
                }
            }
        })
    })
}


/**
 * 查询优秀技能
 */
let querySkill = () => {
    let sql = SQL.UserSQL.querySkill; 
    return queryHelper.queryPromise(sql, null);
}

/**
 * 插入或者更新skill
 * @param {} values 
 */
let insertUpdateSkill = (values) => {
    let sql = SQL.UserSQL.insertUpdateSkill;
    return queryHelper.queryPromise(sql, [values]);
}

/**
 * 个人中心数据汇总
 */
let queryTotalNum = () => {
    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    // 插入用户信息
                    let sql1 = ProjectSQL.projectSQL.queryNum;
                    let res1 = await queryHelper.queryPromise(sql1, null,connection);

                    let sql2 = ProjectAchiSQL.projectAchiSQL.queryAllNum;
                    let res2 = await queryHelper.queryPromise(sql2, null,connection);

                    let sql3 = ProjectAchiSQL.projectAchiSQL.queryAllCaseNum;
                    let res3 = await queryHelper.queryPromise(sql3, null,connection);

                  
                    let data = {
                        allNum: res1.data,
                        projectNum: res2.data,
                        achiNum: res3.data
                    }
                    
                    console.log(data);
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '批量插入用户信息成功',
                        data: data,
                    })
                }
                catch (err) {
                    console.log('出错了，准备回滚', err)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        err: err,
                        msg: '数据库操作失败'
                    })
                }
            }
        })
    })
}


let Dao = {
    login,
    queryLimitUser,
    queryNum,
    query,
    queryUserById,
    queryByFilter,

    insertUserListOth,
    insertUserListTeaStu,

    updatedStatus,
    updatePwc,
    updateUserInfo,

    daleteUserList,
    queryAllFilter,
    saveUserImgfile,
    queryByIdForTeaStu,
    updateByIdForTeaStu,
    querySkill,
    insertUpdateSkill,
    queryTotalNum
}
module.exports = Dao