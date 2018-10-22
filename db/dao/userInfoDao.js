const queryHelper = require('../../util/DBQuery');
const db = require('../../util/DBConfig');
const SQL = require('../sql/userInfoSQL');
const util = require('../../util/utils')

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
    let strBase = 'select user_id, username, email, telno, address, user_type_name, status from userInfo where ';
    strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
    return queryHelper.queryPromise(strBase, null);
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
                    code: 500,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    let sql1 = SQL.UserSQL.updateUserInfo;
                    let res1 = await queryHelper.queryPromise(sql1, [username, email, telno, address, user_type_name, user_id]);
                    if(user_type_name === '教师')  {
                        let sql2 = SQL.UserSQL.updateTeaName;
                        let res2 = await queryHelper.queryPromise(sql2, [username, user_id]);
                    } else  if(user_type_name === '学生'){
                        let sql3 = SQL.UserSQL.updateStuName;
                        let res3 = await queryHelper.queryPromise(sql3, [username, user_id]);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '更改用户信息成功'
                    })
                }
                catch (error) {
                    console.log('出错了，准备回滚', error)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        msg: '更改用户信息失败'
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
                    code: 500,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    // 插入用户信息
                    let sql = SQL.UserSQL.insert;
                    let res1 = await queryHelper.queryPromise(sql, [values]);
                    if(user_type_name === '教师')  {
                        // 插入教师信息
                        let sqltea = SQL.UserSQL.insertTea;
                        let res2 = await queryHelper.queryPromise(sqltea, [valuesOth]);
                    } else  if(user_type_name === '学生'){
                        // 插入学生信息
                        let sqlstu = SQL.UserSQL.insertStu;
                        let res3 = await queryHelper.queryPromise(sqlstu, [valuesOth]);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '插入用户信息成功'
                    })
                }
                catch (error) {
                    console.log('出错了，准备回滚', error)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        msg: '插入用户信息失败'
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
                    code: 500,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    // 插入用户信息
                    let sql = SQL.UserSQL.insert;
                    let res1 = await queryHelper.queryPromise(sql, [values]);
                    // 插入教师信息
                    let sqltea = SQL.UserSQL.insertTea;
                    let res2 = await queryHelper.queryPromise(sqltea, [valuesTea]);
                    // 插入学生信息
                    let sqlstu = SQL.UserSQL.insertStu;
                    let res3 = await queryHelper.queryPromise(sqlstu, [valuesStu]);
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '批量插入用户信息成功'
                    })
                }
                catch (error) {
                    console.log('出错了，准备回滚', error)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        msg: '批量插入用户信息失败'
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
                    code: 500,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()
                    // 删除用户信息
                    let sqlBase = `delete from userInfo where user_id in (`;
                    userList.map((item, index) => {
                        if(index < userList.length - 1) {
                            sqlBase = sqlBase +'\'' +item + '\','
                        } else {
                            sqlBase = sqlBase + '\''+ item + '\');'
                        }
                    })
                    let res1 = await queryHelper.queryPromise(sqlBase, null);
                    // 删除教师信息
                    let sqlBaseTea = `delete from teacher where user_id in (`;
                    teacherList.map((item, index) => {
                        if(index < teacherList.length - 1) {
                            sqlBaseTea = sqlBaseTea +'\'' +item + '\','
                        } else {
                            sqlBaseTea = sqlBaseTea + '\''+ item + '\');'
                        }
                    })
                    let res2 = await queryHelper.queryPromise(sqlBaseTea, null);
                    // 删除学生信息
                    let sqlBaseStu = `delete from student where user_id in (`;
                    studentList.map((item, index) => {
                        if(index < studentList.length - 1) {
                            sqlBaseStu = sqlBaseStu +'\'' +item + '\','
                        } else {
                            sqlBaseStu = sqlBaseStu + '\''+ item + '\');'
                        }
                    })
                    let res3 = await queryHelper.queryPromise(sqlBaseStu, null);
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '批量删除用户信息成功'
                    })
                }
                catch (error) {
                    console.log('出错了，准备回滚', error)
                    await connection.rollback(() => {
                        console.log('回滚成功')
                        connection.release()
                    });
                    resolve({
                        code: 500,
                        msg: '批量删除用户信息失败'
                    })
                }
            }
        })
    })
}






let Dao = {
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
}
module.exports = Dao