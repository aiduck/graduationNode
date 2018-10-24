const queryHelper = require('../../util/DBQuery');
const db = require('../../util/DBConfig');
const SQL = require('../sql/studentInfoSQL');
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
                    code: 500,
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
                        filter['student.user_id'] = user_id;
                        filter['student.username'] = username;
                        let isdelId = delete filter.user_id;
                        let isdelName = delete filter.username;
                        if(isdelId || isdelName) {
                            let strBase = 'SELECT student.user_id, student.username, email, telno, address, user_type_name, status, college_id,major_id,aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id  WHERE ';
                            strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                            res1 = await queryHelper.queryPromise(strBase, null);

                            let strBase2 = 'SELECT count(*) as number FROM student inner join userInfo on student.user_id = userInfo.user_id  WHERE ';
                            strBase2 = strBase2 + util.obj2MySql(filter);
                            res2 = await queryHelper.queryPromise(strBase2, null);
                        }
                    } else {
                        let strBase = 'SELECT student.user_id, student.username, email, telno, address, user_type_name, status, college_id,major_id,aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id  WHERE ';
                        strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                        res1 = await queryHelper.queryPromise(strBase, null);

                        let strBase2 = 'SELECT count(*) as number FROM student inner join userInfo on student.user_id = userInfo.user_id  WHERE ';
                        strBase2 = strBase2 + util.obj2MySql(filter);
                        res2 = await queryHelper.queryPromise(strBase2, null);
                    }

                    // let strBase = 'select user_id, username, email, telno, address, user_type_name, status from userInfo where ';
                    // strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                    // let res1 = await queryHelper.queryPromise(strBase, null);
                    
                    // let strBase2 = 'select count(*) as number from userInfo where ';
                    // strBase2 = strBase2 + util.obj2MySql(filter);
                    // let res2 = await queryHelper.queryPromise(strBase2, null);
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        data: res1.data,
                        total:  res2.data[0].number,
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
 * 更新教师用户信息
 * @param {*} username 
 * @param {*} email 
 * @param {*} telno 
 * @param {*} address 
 * @param {*} user_type_name 
 * @param {*} sex 
 * @param {*} user_id 
 */
let updateUserInfo = (username, email, telno, address, user_type_name, college_id,major_id,aclass_id, user_id) => {
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

                    let sql1 = SQL.UserSQL.updateStuInfo;
                    let res1 = await queryHelper.queryPromise(sql1, [username, college_id,major_id,aclass_id, user_id]);
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
 * 批量插入学生基本信息
 * @param {*数组} values 
 */
let insertUserList = (values, stuvalues) => {
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
                    // 插入学生信息
                    let sql1 = SQL.UserSQL.insert;
                    let res1 = await queryHelper.queryPromise(sql1, [stuvalues]);
                    // 插入用户信息
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
 * @param {*学生id列表} studentList 
 */
let daleteUserList = (userList, studentList) => {
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
                    let sqlBaseStu = `delete from student where user_id in (`;
                    studentList.map((item, index) => {
                        if(index < studentList.length - 1) {
                            sqlBaseStu = sqlBaseStu +'\'' +item + '\','
                        } else {
                            sqlBaseStu = sqlBaseStu + '\''+ item + '\');'
                        }
                    })
                    let res2 = await queryHelper.queryPromise(sqlBaseStu, null);
                    console.log(res2);
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