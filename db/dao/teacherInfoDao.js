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
                    if(filter.user_id !== undefined || filter.username !== undefined) {
                        
                        let user_id =  filter.user_id;
                        let username = filter.username;
                        filter['teacher.user_id'] = user_id;
                        filter['teacher.username'] = username;
                        let isdelId = delete filter.user_id;
                        let isdelName = delete filter.username;
                        if(isdelId || isdelName) {
                            let strBase = 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE ';
                            strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                            // return queryHelper.queryPromise(strBase, null);
                            res1 = await queryHelper.queryPromise(strBase, null,connection);

                            let strBase2 = 'SELECT count(*) as number FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE ';
                            strBase2 = strBase2 + util.obj2MySql(filter);
                            res2 = await queryHelper.queryPromise(strBase2, null,connection);
                        }
                    } else {
                        let strBase = 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE ';
                        strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                        // return queryHelper.queryPromise(strBase, null);
                        res1 = await queryHelper.queryPromise(strBase, null,connection);

                        let strBase2 = 'SELECT count(*) as number FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE ';
                        strBase2 = strBase2 + util.obj2MySql(filter);
                        res2 = await queryHelper.queryPromise(strBase2, null,connection);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '筛选成功',
                        data: res1.data,
                        total: res2.data[0].number,
                       
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
 * 班级信息中的获取教师姓名
 * @param {*} user_id 
 */
let queryByIdForName = (userId) => {
    let sql = SQL.UserSQL.queryByIdForName;
    return queryHelper.queryPromise(sql, userId);
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
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                })
            }
            else {
                try {
                    await connection.beginTransaction()

                    let sql1 = SQL.UserSQL.updateTeaInfo;
                    let res1 = await queryHelper.queryPromise(sql1, [username, sex, job_title, education, user_id],connection);
                    let sql2 = SQL.UserSQL.updateUserInfo;
                    let res2 = await queryHelper.queryPromise(sql2,[username, email, telno, address, user_id],connection)
                    
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
 * 批量插入教师基本信息
 * @param {*数组} values 
 */
let insertUserList = (values, teavalues) => {
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
                    let sql1 = SQL.UserSQL.insert;
                    let res1 = await queryHelper.queryPromise(sql1, [teavalues],connection);
                    // 插入教师信息
                    let sql2 = SQL.UserSQL.insertUser;
                    let res2 = await queryHelper.queryPromise(sql2, [values],connection);
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
 * 批量删除用户信息
 * @param {*用户id列表} userList 
 * @param {*教师id列表} teacherList 
 */
let daleteUserList = (userList, teacherList) => {
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
                    // 删除教师信息
                    let sqlBaseTea = `delete from teacher where user_id in (`;
                    teacherList.map((item, index) => {
                        if(index < teacherList.length - 1) {
                            sqlBaseTea = sqlBaseTea +'\'' +item + '\','
                        } else {
                            sqlBaseTea = sqlBaseTea + '\''+ item + '\');'
                        }
                    })
                    let res2 = await queryHelper.queryPromise(sqlBaseTea, null,connection);
                    // 删除用户信息
                    let sqlBase = `delete from userInfo where user_id in (`;
                    userList.map((item, index) => {
                        if(index < userList.length - 1) {
                            sqlBase = sqlBase +'\'' +item + '\','
                        } else {
                            sqlBase = sqlBase + '\''+ item + '\');'
                        }
                    })
                    let res1 = await queryHelper.queryPromise(sqlBase, null,connection);
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
    let strBase = 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id where ';
    strBase = strBase + util.obj2MySql(filter);
    return queryHelper.queryPromise(strBase, null);
}

/**
 * 查询所有教师ID
 */
let queryAllTeaId = () => {
    let sql = SQL.UserSQL.queryAllTeaId;
    return queryHelper.queryPromise(sql, null);
}


let Dao = {
    insertUserList,

    queryLimitUser,
    queryNum,
    query,

    queryUserById,
    queryByFilter,
    queryByIdForName,

    updateUserInfo,

    daleteUserList,

    queryAllFilter,
    queryAllTeaId
}
module.exports = Dao