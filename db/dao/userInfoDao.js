const queryHelper = require('../../util/DBQuery');
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

let queryByFilter = (filter) => {
    let strBase = 'select user_id, username, email, telno, address, user_type_name, status from userInfo where ';
    strBase = strBase + util.obj2MySql(filter);
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

let updateUserInfo = (username,email,telno,address,user_type_name,user_id) => {
    let sql = SQL.UserSQL.updateUserInfo;
    return queryHelper.queryPromise(sql, [username, email, telno, address, user_type_name, user_id]);
}

/**
 * 批量插入用户基本信息
 * @param {*数组} values 
 */
let insertUserList = (values) => {
    let sql = SQL.UserSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}
/**
 * 批量删除用户信息
 * @param {*用户id列表} userList 
 */
let daleteUserList = (userList) => {
    let sqlBase = `delete from userInfo where user_id in (`;
    userList.map((item, index) => {
        if(index < userList.length - 1) {
            sqlBase = sqlBase + item + ','
        } else {
            sqlBase = sqlBase + item + ');'
        }
    })
    return queryHelper.queryPromise(sqlBase, null);
}






let Dao = {
    queryLimitUser,
    queryNum,
    query,
    queryUserById,
    queryByFilter,

    insertUserList,

    updatedStatus,
    updatePwc,
    updateUserInfo,

    daleteUserList,
}
module.exports = Dao