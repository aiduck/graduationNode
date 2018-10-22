const queryHelper = require('../../util/DBQuery');
const db = require('../../util/DBConfig');
const SQL = require('../sql/teacherInfoSQL');
const util = require('../../util/utils')

/**
 * 查询固定范围的教师信息
 * @param {*limit start} startNum 
 * @param {*limit size} size 
 */
let queryLimitUser = (startNum, size) => {
    let sql = SQL.UserSQL.queryLimit;
    return queryHelper.queryPromise(sql, [startNum, size]);
}
/**
 * 查询教师信息数量
 */
let queryNum = () => {
    let sql = SQL.UserSQL.queryNum;
    return queryHelper.queryPromise(sql, null);
}
/**
 * 查询所有教师信息导出excel
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
/**
 * 筛选教师
 * @param {*筛选条件} filter 
 */
let queryByFilter = (filter,startNum,size) => {
    if(filter.user_id !== undefined) {
        console.log(filter.user_id);
        let user_id =  filter.user_id;
        filter['teacher.user_id'] = user_id;
        if(delete filter.user_id) {
            let strBase = 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE ';
            strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
            return queryHelper.queryPromise(strBase, null);
        }
    } else {
        let strBase = 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE ';
        strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
        return queryHelper.queryPromise(strBase, null);
    }
   
}


/**
 * 更新教师用户信息
 * @param {*} username 
 * @param {*} email 
 * @param {*} telno 
 * @param {*} address 
 * @param {*} user_type_name 
 * @param {*} sex 
 * @param {*} job_title 
 * @param {*} education 
 * @param {*} user_id 
 */
let updateUserInfo = (username, email, telno, address, user_type_name, sex, job_title, education, user_id) => {
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

                    let sql1 = SQL.UserSQL.updateTeaInfo;
                    let res1 = await queryHelper.queryPromise(sql1, [username, sex, job_title, education, user_id]);
                    let sql2 = SQL.UserSQL.updateUserInfo;
                    let res2 = await queryHelper.queryPromise(sql2,[username, email, telno, address, user_id])
                    
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
 * 批量插入教师基本信息
 * @param {*数组} values 
 */
let insertUserList = (values, teavalues) => {
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
                    let sql1 = SQL.UserSQL.insert;
                    let res1 = await queryHelper.queryPromise(sql1, [teavalues]);
                    // 插入教师信息
                    let sql2 = SQL.UserSQL.insertUser;
                    let res2 = await queryHelper.queryPromise(sql2, [values]);
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
 * 批量删除用户信息
 * @param {*用户id列表} userList 
 * @param {*教师id列表} teacherList 
 */
let daleteUserList = (userList, teacherList) => {
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
    insertUserList,

    queryLimitUser,
    queryNum,
    query,


    queryUserById,
    queryByFilter,

    

    updateUserInfo,

    daleteUserList,
}
module.exports = Dao