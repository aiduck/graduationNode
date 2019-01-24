const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/projectReportSQL');
const userInfoSQL = require('../sql/userInfoSQL');
const projectTeamSQL = require('../sql/projectTeamSQL');
const projectInfoSQL = require('../sql/projectInfoSQL');
const classInfoSQL = require('../sql/classInfoSQL');
const util = require('../../util/utils');


/**
 * 添加记录
 * @param {*数组} values 
 */
let insterProjectReport = (values) => {
    let sql = SQL.projectReportSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}

/**
 * 检查输入的用户ID以及登录的用户信息是否相符，相符返回该用户参与的项目ID
 * @param {*} user_id 
 * @param {*} username 
 */
let checkUserIdAndRetPro = (user_id, username,sub_time) => {
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
                    // 查询用户ID
                    let sql = userInfoSQL.UserSQL.checkUserId;
                    let res = await queryHelper.queryPromise(sql, user_id);
                    let res2;
                    if(res.data[0].username === username) {
                        let sql2 = projectTeamSQL.projectTeamSQL.queryProIDByUserID;
                        res2 = await queryHelper.queryPromise(sql2, user_id);
                        let data = [];
                        console.log(res2.data)
                        for(let i = 0; i < res2.data.length; i++) {
                            if(util.diffStrTime(sub_time,res2.data[i].deadline)) {
                                data.push(res2.data[i]);
                            }
                        }
                        console.log(data);
                        await connection.commit()
                        connection.release()
                        resolve({
                            code: 200,
                            data: data,
                            msg: '查询成功',
                        })
                    } else {
                        await connection.commit()
                        connection.release()
                        resolve({
                            code: 401, // 特殊用户验证失败
                            msg: '检查是否填写正确的用户ID'
                        })
                    }
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
 * 用户查询所有项目日报
 * @param {*} user_id 
 * @param {*} startNum 
 * @param {*} size 
 */
let queryReport = (user_id,usertype,startNum,size,sub_time) => {
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
                    let sql1;
                    let res1;
                    let sql2;
                    let res2;
                    if(usertype === '学生') {
                        sql1 = SQL.projectReportSQL.queryAllByStu;
                        res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                        sql2 = SQL.projectReportSQL.queryNumByStu; 
                        res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
                    } else  if(usertype === '教师') {
                        sql1 = SQL.projectReportSQL.queryAllByTea;
                        res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                        sql2 = SQL.projectReportSQL.queryNumByTea; 
                        res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
                    } else if(usertype === '管理员') {
                        sql1 = SQL.projectReportSQL.queryAll;
                        res1 = await queryHelper.queryPromise(sql1, [startNum, size], connection);
                        sql2 = SQL.projectReportSQL.queryAllNum; 
                        res2 = await queryHelper.queryPromise(sql2, null ,connection); 
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '查询成功',
                        data: res1.data,
                        number: res2.data[0].number,
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
 * 查询日报信息以及相关信息
 * @param {*} report_id 
 */
let queryReportById = (report_id) => {
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

                    // 项目日报
                    let sql1 = SQL.projectReportSQL.queryRepById;
                    let res1 = await queryHelper.queryPromise(sql1, report_id, connection);
                    // 项目
                    let sql2 = projectInfoSQL.projectSQL.queryById;
                    let res2 = await queryHelper.queryPromise(sql2, res1.data[0].project_id, connection);
                    // 提交者学生信息
                    let sql3 = userInfoSQL.UserSQL.queryById;
                    let res3 = await queryHelper.queryPromise(sql3, res1.data[0].user_id, connection);
                    // 项目组信息
                    let sql4 = projectTeamSQL.projectTeamSQL.queryByProjectId;
                    let res4 = await queryHelper.queryPromise(sql4, res1.data[0].project_id, connection);
                    // 教学班级信息
                    let sql5 = classInfoSQL.ClassSQL.queryById;
                    let res5 = await queryHelper.queryPromise(sql5, res4.data[0].class_id, connection);
                    // 教师信息
                    let sql6 = userInfoSQL.UserSQL.queryById;
                    let res6 = await queryHelper.queryPromise(sql6, res5.data[0].user_id, connection);

                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '查询成功',
                        data: {
                            report: res1.data[0],
                            project: res2.data[0],
                            student: res3.data[0],
                            team: res4.data[0],
                            classes: res5.data[0],
                            teacher: res6.data[0]
                        }
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
 * 学生更新日报或者教师评定日报
 * @param {*} usertype 
 * @param {*} report_id 
 * @param {*} report_date 
 * @param {*} report_time 
 * @param {*} report_work 
 * @param {*} report_problem 
 * @param {*} report_plan 
 * @param {*} report_status 
 * @param {*} report_comment 
 */
let updateReport =  (usertype,report_id,report_date,report_time,report_work,report_problem, report_plan,report_status,report_comment) => {
    if(usertype === '学生') {
        let sql = SQL.projectReportSQL.updateReportByStu;
        return queryHelper.queryPromise(sql, [report_date,report_time,report_work,report_problem, report_plan,report_id]);
    } else {
        let sql = SQL.projectReportSQL.updateReportByTea;
        return queryHelper.queryPromise(sql, [report_status,report_comment,report_id]);
    }
}

/**
 * 删除日报信息
 * @param {*} report_id 
 */
let deleteReport = (report_id) => {
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

                    // 项目日报
                    let sql1 = SQL.projectReportSQL.queryRepById;
                    let res1 = await queryHelper.queryPromise(sql1, report_id, connection);
                    let sql2;
                    let res2;
                    if(res1.data[0].report_status === '未审核') {
                        sql2 = SQL.projectReportSQL.deleteReport;
                        res2 = await queryHelper.queryPromise(sql2, report_id, connection);
                        await connection.commit()
                        connection.release()
                        resolve({
                            code: 200,
                            msg: '删除成功',
                        })
                    } else {
                        await connection.commit()
                        connection.release()
                        resolve({
                            code: 202,
                            msg: '不能删除已审核的文章',
                        });
                    }
                    
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
 * 筛选日报
 * @param {*} filter 
 * @param {*} startNum 
 * @param {*} size 
 */
let queryByFilter = (filter,startNum,size) => {
    return new Promise(async (resolve, reject) => {
        await db.getConnection(async (err, connection) => {
            if (err) {
                resolve({
                    code: 501,
                    err: err,
                    msg: '获取数据库链接失败'
                });
            }
            else {
                try {
                    await connection.beginTransaction()

                    let project_id =  filter.project_id;
                    filter['daily_report.project_id'] = project_id;
                    delete filter.project_id;

                    let strBase = 'select report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id, deadline from daily_report,project where project.project_id = daily_report.project_id and ';
                    strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                    let res1 = await queryHelper.queryPromise(strBase, null,connection);

                    let strBase2 = 'select count(*) as number from daily_report where ';
                    strBase2 = strBase2 + util.obj2MySql(filter);
                    let res2 = await queryHelper.queryPromise(strBase2, null,connection);
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


let Dao = {
    insterProjectReport,
    checkUserIdAndRetPro,
    queryReport,
    queryReportById,
    updateReport,
    deleteReport,
    queryByFilter
}
module.exports = Dao