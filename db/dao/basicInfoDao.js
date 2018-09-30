const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/basicInfoSQL');


// 获取所有学院信息数量
let queryCollege = () => {
    let AdClassSQL = SQL.AdClassSQL;
    let sql = AdClassSQL.query;
    return queryHelper.queryPromise(sql, null);
}
// 获取对应学院的专业信息
let queryMajorFromCol = (collegeId) => {
    let MajorSQL = SQL.MajorSQL;
    let sql = MajorSQL.getMajorById;
    return queryHelper.queryPromise(sql, collegeId);
}
// 获取对应专业的班级信息
let queryClassFromMajor = (majorId) => {
    let AdClassSQL = SQL.AdClassSQL;
    let sql = AdClassSQL.getClassById;
    return queryHelper.queryPromise(sql, majorId);
}

let Dao = {
    queryCollege,
    queryMajorFromCol,
    queryClassFromMajor
}
module.exports = Dao