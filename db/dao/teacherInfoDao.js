const queryHelper = require('../../util/DBQuery');
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

let queryByFilter = (filter) => {
    let strBase = 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE ';
    strBase = strBase + util.obj2MySql(filter);
    return queryHelper.queryPromise(strBase, null);
}



let updateUserInfo = (username, email, telno, address, user_type_name, sex, job_title, education, user_id) => {
    let sql = SQL.UserSQL.updateUserInfo;
    return queryHelper.queryPromise(sql, [username, email, telno, address, user_type_name, sex, job_title, education, user_id]);
}

/**
 * 批量插入教师基本信息
 * @param {*数组} values 
 */
let insertUserList = (values) => {
    let sql = SQL.UserSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}
/**
 * 批量删除教师信息
 * @param {*用户id列表} userList 
 */
let daleteUserList = (userList) => {
    let sqlBase = `delete teacher.*, userInfo.* from teacher, userInfo  where teacher.user_id =  userInfo.user_id and userInfo.user_id in (`;
    userList.map((item, index) => {
        if(index < userList.length - 1) {
            sqlBase = sqlBase + '\'' +item + '\','
        } else {
            sqlBase = sqlBase + '\''+ item + '\');'
        }
    })
    return queryHelper.queryPromise(sqlBase, null);
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