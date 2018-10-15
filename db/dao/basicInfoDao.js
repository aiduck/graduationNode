const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/basicInfoSQL');

// 学院操作
/**
 * 批量插入学院信息
 * @param {*数组} values 
 */
let insertCollege = (values) => {
    let sql = SQL.CollegeSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}
/**
 * 获取所有学院信息信息
 */
let queryCollege = () => {
    let sql = SQL.CollegeSQL.query;
    return queryHelper.queryPromise(sql, null);
}
/**
 * 返回特定学院的状态
 * @param {*学院Id} collegeId 
 */
let queryColSta = (collegeId) => {
    let sql = SQL.CollegeSQL.queryStatus;
    return queryHelper.queryPromise(sql, collegeId);
}

// 专业操作
/**
 * 批量插入专业信息
 * @param {*专业数组} values 
 */
let insertMajor = (values) => {
    let sql = SQL.MajorSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}
/**
 * 获取对应学院的专业信息
 * @param {*学院id} collegeId 
 */
let queryMajorById = (collegeId) => {
    let sql = SQL.MajorSQL.getMajorById;
    return queryHelper.queryPromise(sql, collegeId);
}

// 班级操作

/**
 * 批量插入班级信息
 * @param {*班级数组} values 
 */
let insertAdclass = (values) => {
    let sql = SQL.AdClassSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}
/**
 * 获取对应专业的班级信息
 * @param {*专业id} majorId
 */
let queryAdClassById = (majorId) => {
    let sql = SQL.AdClassSQL.getClassById;
    return queryHelper.queryPromise(sql, majorId);
}

// 状态操作(启用/禁用)
/**
 * 更新学院或者专业本身状态
 * @param {*更新对象} type 
 * @param {*更新状态} status 
 * @param {*定位信息} item 
 */
let updateStatus = (type,status,item) => {
    if(type === 'college') {
        let id = item.college_id;
        let sql = SQL.StatueSQL.updateColStatue;
        return queryHelper.queryPromise(sql, [status, id]);
    }
    else if(type === 'major') {
        let id = item.major_id;
        let sql = SQL.StatueSQL.updateMajStatue;
        return queryHelper.queryPromise(sql, [status, id]);
    }
}
/**
 * 根据学院id 更新学院下面所有专业状态
 * @param {*更新状态} status 
 * @param {*学院id} id 
 */
let updateMajStaByCol = (status, id) => {
    let sql = SQL.StatueSQL.updateAllMajSta;
    return queryHelper.queryPromise(sql, [status, id]);
}

// 删除操作
let delAdclass = (adclassObj) => {
    let sql = SQL.DelSQL.delAdclass;
    return queryHelper.queryPromise(sql, [adclassObj.major_id, adclassObj.aclass_id]);
}

// 添加操作
let addBasicInfo = (type, value) => {
    
    if(type === 'college') {
        let sql = SQL.AddSAL.addCollege;
        return queryHelper.queryPromise(sql, [value]);
    } else  if(type === 'major') {
        let sql = SQL.AddSAL.addMajor;
        return queryHelper.queryPromise(sql, [value]);
    } else if(type === 'adclass') {
        let sql = SQL.AddSAL.addAdclass;
        return queryHelper.queryPromise(sql, [value]);
    }
}
let Dao = {
    insertCollege,
    queryCollege,
    queryColSta,

    insertMajor,
    queryMajorById,

    insertAdclass,
    queryAdClassById,

    updateStatus,
    updateMajStaByCol, // 多处来的更新所有major的状态的操作

    delAdclass,

    addBasicInfo,
}
module.exports = Dao