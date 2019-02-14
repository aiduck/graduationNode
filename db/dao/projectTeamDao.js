const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/projectTeamSQL');
const util = require('../../util/utils');


/**
 * 插入小组信息
 * @param {*数组} values 
 */
let insterProjectTeam = (values,project_id) => {
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
            // 插入team
            let sql = SQL.projectTeamSQL.insert;
            let res = await queryHelper.queryPromise(sql, [values]);
            // 改变project的is_choose内容
            let sql1 = `UPDATE project SET is_choose= '不可选' WHERE project_id= ?`;
            let res1 = await queryHelper.queryPromise(sql1, project_id,connection);
            
            await connection.commit()
            connection.release()
            resolve({
              code: 200,
              msg: '查询成功',
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
 * 搜索团队信息
 * @param {*} startNum 
 * @param {*} size 
 */
let queryLimitTeam = (startNum, size,usertype,user_id) => {

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

            sql1 = SQL.projectTeamSQL.queryAllByStu;
            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
            sql2 = SQL.projectTeamSQL.queryNumByStu; 
            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 
      
          } else  if(usertype === '教师') {
            sql1 = SQL.projectTeamSQL.queryAllByTea;
            res1 = await queryHelper.queryPromise(sql1, [user_id,startNum, size], connection);
            sql2 = SQL.projectTeamSQL.queryNumByTea; 
            res2 = await queryHelper.queryPromise(sql2, user_id, connection); 

          } else if(usertype === '管理员') {
            sql1 = SQL.projectTeamSQL.queryLimit;
            res1 = await queryHelper.queryPromise(sql1, [startNum, size],connection);
            sql2 = SQL.projectTeamSQL.queryNum; 
            res2 = await queryHelper.queryPromise(sql2, null,connection);
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
 * 删除团队（包括删除团队的成员）
 * @param {*} team_id 
 */
let deleteTeam = (team_id) => {
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

                let sql2 = SQL.projectTeamSQL.deleteTeamAndMember;
                let res2 =  await queryHelper.queryPromise(sql2, team_id,connection);


                let sql = SQL.projectTeamSQL.deleteTeam;
                let res = await queryHelper.queryPromise(sql, team_id,connection);

                await connection.commit()
                connection.release()
                resolve({
                    code: 200,
                    msg:'success'
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
 * 筛选
 * @param {*筛选条件} filter 
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
            })
        }
        else {
            try {
                await connection.beginTransaction()

                let course_id =  filter.course_id;
                filter['team.course_id'] = course_id;
                let isdelcourse_id = delete filter.course_id;

                let class_id =  filter.class_id;
                filter['team.class_id'] = class_id;
                let isdelclass_id = delete filter.class_id;

                let user_id =  filter.user_id;
                filter['team.user_id'] = user_id;
                let isdeluser_id = delete filter.user_id;

                let project_id =  filter.project_id;
                filter['team.project_id'] = project_id;
                let isdelproject_id = delete filter.project_id;

                let strBase = ` SELECT team.team_id, team.team_name, team.course_id, team.class_id, team.user_id, team.project_id, course_name, class_name, username, project_name FROM team, course, classes, student, project 
                where team.course_id = course.course_id and team.class_id = classes.class_id and team.user_id = student.user_id  and team.project_id = project.project_id and  `;
                strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                let res1 = await queryHelper.queryPromise(strBase, null,connection);
              
                let strBase2 = 'select count(*) as number from team where ';
                strBase2 = strBase2 + util.obj2MySql(filter);
                let res2 = await queryHelper.queryPromise(strBase2, null,connection);
                await connection.commit()
                connection.release()
                resolve({
                    code: 200,
                    data: res1.data,
                    total:  res2.data[0].number,
                    msg: '筛选成功'
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
 * 查询班级，团队，项目,团队成员信息
 * @param {*} team_id 
 */
let queryById = (team_id) => {

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
          // team内容
          let sql1 = SQL.projectTeamSQL.queryById;
          let res1 = await queryHelper.queryPromise(sql1, team_id,connection);
          // classes内容
          let sql2 = 'select * from classes where class_id = ?'
          let res2 = await queryHelper.queryPromise(sql2, res1.data[0].class_id,connection);
          // project内容
          let sql3 = 'select * from project where project_id = ?'
          let res3 = await queryHelper.queryPromise(sql3, res1.data[0].project_id,connection);

          // 团队成员信息
          let sql4 = 'select * from team_members where team_id = ?'
          let res4 = await queryHelper.queryPromise(sql4, team_id,connection);
          // console.log(res4.data);
          

          let stuIDString =JSON.stringify(res4.data);
          // console.log('>> string: ', stuIDString );
          let stuIDJson =  JSON.parse(stuIDString);
          // console.log('>> json: ', stuIDJson);

          let stuIdlength = util.getJsonLength(stuIDJson);
          let res5;
          if(stuIdlength > 0) {
            let sql5 = 'select * from student where user_id in ('
            stuIDJson.map((item,index) => {
              // console.log(item.user_id);
              if(index === stuIdlength-1) {
                sql5 = sql5 + item.user_id + ')'
              } else {
                sql5 = sql5 + item.user_id + ','
              }
            })
            res5 = await queryHelper.queryPromise(sql5, null,connection);
          } else {
            res5 = []
          }
          // console.log(res5);
          let team = {
            ...res1.data
          }
          let _class = {
            ...res2.data
          }
          let project = {
            ...res3.data
          }
          let studentList = {
            ...res5.data
          }
          let data = {
            team,
            _class,
            project,
            studentList
          }
          await connection.commit()
          connection.release()
          resolve({
            code: 200,
            msg: '查询成功',
            data: data,
            
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
 * 修改特殊个体内容
 * @param {*} team_name 
 * @param {*} class_id 
 * @param {*} user_id 
 * @param {*} project_id 
 * @param {*} team_id 
 */
let updateProjectTeamInfo = (team_name,course_id,class_id,user_id,project_id,team_id) => {
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
  
          let sql = SQL.projectTeamSQL.updateProjectTeamInfo;
          let res = await queryHelper.queryPromise(sql, [team_name,course_id,class_id,user_id,project_id,team_id],connection);
  
          let sql1 = SQL.projectTeamSQL.insertTeamMember;
          let values = [];
          let value = [`${team_id}`,`${user_id}`];
          values.push(value);
          let res1 = await queryHelper.queryPromise(sql1, [values],connection);
          
          await connection.commit()
          connection.release()
          resolve({
            code: 200,
            msg: '查询成功',
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
 * 插入团队成员
 * @param {*} team_id 
 * @param {*} user_id 
 * @param {*} project_id 
 */
let insertTeamMember = (team_id,user_id,project_id) => {
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

          let sql = SQL.projectTeamSQL.insertTeamMember;
          let values = [];
          let value = [`${team_id}`,`${user_id}`];
          values.push(value);
          let res =  await queryHelper.queryPromise(sql, [values],connection);

          let sql2 = SQL.projectTeamSQL.insertScore;
          let values2 = [];
          let value2 = [`${user_id}`,`${project_id}`];
          values2.push(value2);
          let res2 =  await queryHelper.queryPromise(sql2, [values2],connection);


          await connection.commit()
          connection.release()
          resolve({
            code: 200,
            msg: '查询成功',
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
 * 删除项目成员
 * @param {*} team_id 
 * @param {*} user_id 
 * @param {*} project_id 
 */
let deleteTeamMember = (team_id,user_id,project_id) => {
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

          let sql = SQL.projectTeamSQL.deleteTeamMember;
          let res1 =  await queryHelper.queryPromise(sql, [team_id,user_id],connection);

          let sql2 = SQL.projectTeamSQL.deleteScore;
          let res2 =  await queryHelper.queryPromise(sql2, [user_id,project_id],connection);

          await connection.commit()
          connection.release()
          resolve({
            code: 200,
            msg: '查询成功',
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
  insterProjectTeam,
  queryLimitTeam,
  deleteTeam,
  queryByFilter,
  queryById,
  updateProjectTeamInfo,
  insertTeamMember,
  deleteTeamMember
}
module.exports = Dao