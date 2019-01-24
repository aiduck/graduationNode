const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/projectAchiSQL');
const userInfoSQL = require('../sql/userInfoSQL');
const projectTeamSQL = require('../sql/projectTeamSQL');
const projectInfoSQL = require('../sql/projectInfoSQL');
const classInfoSQL = require('../sql/classInfoSQL');
const utils = require('../../util/utils')

/**
 * 添加记录前查询是否小组成员已经添加了信息
 * @param {*} values 
 */
let queryAchiByProId = (project_id) => {
    let sql = SQL.projectAchiSQL.queryAchiByProId;
    return queryHelper.queryPromise(sql, project_id);
}

/**
 * 添加记录
 * @param {*数组} values 
 */
let insterProjectAchi = (values) => {
    let sql = SQL.projectAchiSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}

/**
 * 用户查询所有项目成果list
 * @param {*} user_id 
 * @param {*} startNum 
 * @param {*} size 
 */
let queryprojectAchiList = (user_id,usertype,startNum,size) => {
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
                            // 学生的ID 获取学生参加的项目小组的所有项目id
                            // 通过项目id获取所有成果信息
                            sql1 = SQL.projectAchiSQL.queryAllByStu;
                            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                            sql2 = SQL.projectAchiSQL.queryNumByStu; 
                            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 

                        } else  if(usertype === '教师') {
                            sql1 = SQL.projectAchiSQL.queryAllByTea;
                            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                            sql2 = SQL.projectAchiSQL.queryNumByTea; 
                            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
                        } else if(usertype === '管理员') {
                            sql1 = SQL.projectAchiSQL.queryAll;
                            res1 = await queryHelper.queryPromise(sql1, [startNum, size], connection);
                            sql2 = SQL.projectAchiSQL.queryAllNum; 
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
 * 用户查询特殊项目成果
 * @param {*} delivery_id 
 */
let queryprojectAchiDetil = (delivery_id) => {
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
                    let sql1 = SQL.projectAchiSQL.queryAchiById;
                    let res1 = await queryHelper.queryPromise(sql1, delivery_id, connection);
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
                            delivery: res1.data[0],
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
 * 更新项目成果信息
 * @param {*} title 
 * @param {*} submit_date 
 * @param {*} submit_time 
 * @param {*} project_id 
 * @param {*} user_id 
 * @param {*} delivery_id 
 */
let updateprojectAchi =  (title,submit_date,submit_time,project_id,user_id,delivery_id) => {
    let sql = SQL.projectAchiSQL.updateAchi;
    return queryHelper.queryPromise(sql, [title,submit_date,submit_time,project_id,user_id,delivery_id]);
}



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
                    let project_id =  filter.project_id;
                    filter['delivery.project_id'] = project_id;
                    delete filter.project_id;

                    await connection.beginTransaction()
                    let strBase = 'select delivery_id,title,submit_date,submit_time,delivery.project_id,delivery.user_id,deadline from delivery,project where project.project_id = delivery.project_id and ';
                    strBase = strBase + utils.obj2MySql(filter) + `limit ${startNum},${size}`;
                    let res1 = await queryHelper.queryPromise(strBase, null,connection);

                    let strBase2 = 'select count(*) as number from delivery where ';
                    strBase2 = strBase2 + utils.obj2MySql(filter);
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


/**
 * 保存项目成果文件
 * @param {*} values 
 */
let saveAchifile = (values,submit_date,submit_time,delivery_id) => {
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
                        await connection.beginTransaction();

                        let sql1 = SQL.projectAchiSQL.saveAchifile;
                        let res1 = await queryHelper.queryPromise(sql1, [values]);
                        
                        let sql2 = SQL.projectAchiSQL.updateAchiByFile;
                        let res2 = await queryHelper.queryPromise(sql2, [submit_date,submit_time,delivery_id]);

                        await connection.commit()
                        connection.release()
                        resolve({
                            code: 200,
                            msg: '查询成功',
                            data: []
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
 * 获取文件列表
 * @param {*} delivery_id 
 */
let getAchifileList = (delivery_id) => {
    let sql = SQL.projectAchiSQL.getAchifileList;
    return queryHelper.queryPromise(sql, delivery_id);
}

/**
 * 删除delivery_id的所有文件
 * @param {*} delivery_id 
 */
let deleteAllAchifile = (delivery_id) => {
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
                    let sql1 = SQL.projectAchiSQL.getAchifileList;
                    let res1 = await queryHelper.queryPromise(sql1, delivery_id);
                    let sql2;
                    let res2;
                    if(res1.code === 200) {
                        for(let i =0; i < res1.data.length; i++) {
                            let filepath = res1.data[i].filepath
                            let  index = filepath.lastIndexOf("\/");  
                            let originfilename  = filepath.substring(index + 1, filepath.length);
                            utils.deleteFile('/Users/yanghechenji/Desktop/毕设/code/node/public/uploads/fileDemo/',originfilename);
                        }
                        sql2 = SQL.projectAchiSQL.deleteAllAchifile;
                        res2 = await queryHelper.queryPromise(sql2, delivery_id);
                    }
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '查询成功',
                        data: []
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
 * 删除delivery_id的单个文件
 * @param {*} delivery_id 
 * @param {*} filepath 
 * @param {*} filename 
 */
let deleteAchifile = (delivery_id,filepath,filename) => {
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
                    let index = filepath.lastIndexOf("\/");  
                    let originfilename  = filepath.substring(index + 1, filepath.length);
                    utils.deleteFile('/Users/yanghechenji/Desktop/毕设/code/node/public/uploads/fileDemo/',originfilename);
              
                    let sql1 = SQL.projectAchiSQL.deleteAchifile;
                    let res1 = await queryHelper.queryPromise(sql1, [delivery_id,filepath,filename]);
    
                    await connection.commit()
                    connection.release()
                    resolve({
                        code: 200,
                        msg: '查询成功',
                        data: []
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
    queryAchiByProId,
    insterProjectAchi,
    queryprojectAchiList,
    queryprojectAchiDetil,
    saveAchifile,
    getAchifileList,
    updateprojectAchi,
    deleteAllAchifile,
    deleteAchifile,
    queryByFilter
}
module.exports = Dao