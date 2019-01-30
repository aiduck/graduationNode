const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/projectScoreSQL');
const TeamSQL = require('../sql/projectTeamSQL');
const projectInfoSQL = require('../sql/projectInfoSQL');
const courseInfoSQL = require('../sql/courseInfoSQL');
const achiSQL = require('../sql/projectAchiSQL');
const util = require('../../util/utils');



/**
 * 用户查询所有项目
 * @param {*} user_id 
 * @param {*} usertype 
 * @param {*} startNum 
 * @param {*} size 
 */
let queryProjectScore = (user_id,usertype,startNum,size) => {
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
                            sql1 = SQL.projectScoreSQL.queryAllByStu;
                            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                            sql2 = SQL.projectScoreSQL.queryAllByStuNum; 
                            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
                        } else  if(usertype === '教师') {
                            sql1 = SQL.projectScoreSQL.queryAllByTea;
                            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
                            sql2 = SQL.projectScoreSQL.queryAllByTeaNum; 
                            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
                        } else if(usertype === '管理员') {
                            sql1 = SQL.projectScoreSQL.queryAll;
                            res1 = await queryHelper.queryPromise(sql1, [startNum, size], connection);
                            sql2 = SQL.projectScoreSQL.queryNum; 
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
 * 用户查询所有项目
 * @param {*} team_id 
 * @param {*} usertype
 * @param {*} user_id 
 */
let queryProjectScoreDetail = (team_id,usertype,user_id) => {
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
                        let sql3;
                        let res3;
                        let sql4;
                        let res4;
                        let sql5;
                        let res5;
                        let studentList = []
                        if(usertype === '学生') {
                            // 项目小组
                            sql1 = TeamSQL.projectTeamSQL.queryById
                            res1 = await queryHelper.queryPromise(sql1, team_id,connection);

                            // 项目信息
                            sql2 = projectInfoSQL.projectSQL.queryById;
                            res2 = await queryHelper.queryPromise(sql2, res1.data[0].project_id,connection);
                            // 课程信息
                            sql3 = courseInfoSQL.CourseSQL.queryById;
                            res3 = await queryHelper.queryPromise(sql3, res1.data[0].course_id,connection);

                            // 项目成果
                            sql4 = achiSQL.projectAchiSQL.queryAchiByProIdAll;
                            res4 = await queryHelper.queryPromise(sql4, res1.data[0].project_id, connection);
                            
                            //项目中自己的信息
                            sql5 = TeamSQL.projectTeamSQL.queryOnlyTeamMember;
                            res5 = await queryHelper.queryPromise(sql5, [team_id,user_id], connection);
                            if(res5.data) {
                                res5.data.map((item) => {
                                    console.log(item);
                                    if(item.project_id === res1.data[0].project_id){
                                        studentList.push(item);
                                    }
                                });
                            }
                        } else {
                            // 项目小组
                            sql1 = TeamSQL.projectTeamSQL.queryById
                            res1 = await queryHelper.queryPromise(sql1, team_id,connection);

                            // 项目信息
                            sql2 = projectInfoSQL.projectSQL.queryById;
                            res2 = await queryHelper.queryPromise(sql2, res1.data[0].project_id,connection);
                            // 课程信息
                            sql3 = courseInfoSQL.CourseSQL.queryById;
                            res3 = await queryHelper.queryPromise(sql3, res1.data[0].course_id,connection);

                            // 项目成果
                            sql4 = achiSQL.projectAchiSQL.queryAchiByProIdAll;
                            res4 = await queryHelper.queryPromise(sql4, res1.data[0].project_id, connection);

                            // 项目组成员信息
                            sql5 =  TeamSQL.projectTeamSQL.queryAllTeamMembers
                            res5 = await queryHelper.queryPromise(sql5, team_id,connection);

                            if(res5.data) {
                                res5.data.map((item) => {
                                    console.log(item);
                                    if(item.project_id === res1.data[0].project_id){
                                        studentList.push(item);
                                    }
                                });
                            }
                        }
                        await connection.commit()
                        connection.release()
                        resolve({
                            code: 200,
                            msg: '查询成功',
                            data: {
                                team: res1.data[0],
                                project: res2.data[0],
                                course: res3.data[0],
                                delivery: res4.data[0],
                                teamMembers: studentList
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
 * 更新一个项目小组中所有成员的成绩信息
 * @param {*} studentList 
 */
let updateScore = (studentList) => {
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
                        let usual_performance,project_score,final_score, user_id, project_id;
                        await connection.beginTransaction()
                        let sql1 = SQL.projectScoreSQL.updateScore;
                        let res1;
                        for(let i = 0; i < studentList.length; i++) {
                            usual_performance = studentList[i].usual_performance;
                            project_score = studentList[i].project_score;
                            final_score = studentList[i].final_score;
                            user_id = studentList[i].user_id;
                            project_id = studentList[i].project_id;
                            res1 = await queryHelper.queryPromise(sql1, [usual_performance,project_score,final_score, user_id, project_id],connection);
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
                    filter['team.project_id'] = project_id;
                    delete filter.project_id;

                    let team_id =  filter.team_id;
                    filter['team.team_id'] = team_id;
                    delete filter.team_id;

                    let course_id =  filter.course_id;
                    filter['team.course_id'] = course_id;
                    delete filter.course_id;

                    let user_id =  filter.user_id;
                    filter['team.user_id'] = user_id;
                    delete filter.user_id;
                    

                    let strBase = 'select project.project_id,project.project_name,course.course_id,course.course_name,course.ratio_usual,course.ratio_project,team.team_id,team.user_id from team,project,course where team.project_id = project.project_id and team.course_id = course.course_id and ';
                   

                    strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                    let res1 = await queryHelper.queryPromise(strBase, null,connection);

                    let strBase2 = 'select count(*) as number from team where ';
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
    queryProjectScore,
    queryProjectScoreDetail,
    updateScore,
    queryByFilter
}
module.exports = Dao