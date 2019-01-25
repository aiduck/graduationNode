const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/projectSelfEvalSQL');
const userInfoSQL = require('../sql/userInfoSQL');
const projectTeamSQL = require('../sql/projectTeamSQL');
const projectInfoSQL = require('../sql/projectInfoSQL');
const classInfoSQL = require('../sql/classInfoSQL');
const util = require('../../util/utils');

/**
 * 添加记录前查询是否小组成员已经添加了信息
 * @param {*} values 
 */
let querySelfByProId = (project_id) => {
    let sql = SQL.projectSelfEvalSQL.querySelfByProId;
    return queryHelper.queryPromise(sql, project_id);
}

/**
 * 添加记录
 * @param {*数组} values 
 */
let insterProjectSelfEval = (values) => {
    let sql = SQL.projectSelfEvalSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}

/**
 * 用户查询所有项目自评
 * @param {*} user_id 
 * @param {*} startNum 
 * @param {*} size 
 */
let querySelfEval = (user_id,usertype,startNum,size,sub_time) => {
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
                            sql1 = SQL.projectSelfEvalSQL.queryAllByStu;
                            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                            sql2 = SQL.projectSelfEvalSQL.queryNumByStu; 
                            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
                        } else  if(usertype === '教师') {
                            sql1 = SQL.projectSelfEvalSQL.queryAllByTea;
                            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                            sql2 = SQL.projectSelfEvalSQL.queryNumByTea; 
                            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
                        } else if(usertype === '管理员') {
                            sql1 = SQL.projectSelfEvalSQL.queryAll;
                            res1 = await queryHelper.queryPromise(sql1, [startNum, size], connection);
                            sql2 = SQL.projectSelfEvalSQL.queryAllNum; 
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
 * 删除自评信息
 * @param {*} id 
 */
let deleteSelf = (id) => {
    let sql = SQL.projectSelfEvalSQL.deleteSelf;
    return queryHelper.queryPromise(sql, id);
}

/**
 * 查询自评信息以及相关信息
 * @param {*} id 
 */
let querySelfById = (id) => {
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

                    // 项目自评
                    let sql1 = SQL.projectSelfEvalSQL.querySelfById;
                    let res1 = await queryHelper.queryPromise(sql1, id, connection);
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
                            selfEval: res1.data[0],
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
 * 更新操作
 * @param {*} tasks 
 * @param {*} workload 
 * @param {*} assessment 
 * @param {*} score 
 * @param {*} date 
 * @param {*} time 
 * @param {*} id 
 */
let updataSelf = (tasks,workload,assessment,score, date, time,id) => {
    let sql = SQL.projectSelfEvalSQL.updateSelf;
    return queryHelper.queryPromise(sql, [tasks,workload,assessment,score, date, time,id]);
}

/**
 * 筛选
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
                    filter['self_evaluation.project_id'] = project_id;
                    delete filter.project_id;

                    let strBase = 'select id,tasks,workload,assessment,score,date,time,self_evaluation.project_id,self_evaluation.user_id, deadline from self_evaluation,project where project.project_id = self_evaluation.project_id and ';
                    strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                    let res1 = await queryHelper.queryPromise(strBase, null,connection);

                    let strBase2 = 'select count(*) as number from self_evaluation where ';
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
    insterProjectSelfEval,
    querySelfByProId,
    querySelfEval,
    deleteSelf,
    querySelfById,
    updataSelf,
    queryByFilter
}
module.exports = Dao