const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/projectInfoSQL');
const util = require('../../util/utils');


/**
 * 批量插入
 * @param {*数组} values 
 */
let insterProject = (values) => {
    let sql = SQL.projectSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}

/**
 * 搜索项目信息
 * @param {*} startNum 
 * @param {*} size 
 */
let queryLimitProject = (startNum, size) => {

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
          
          let sql1 = SQL.projectSQL.queryLimit;
          let res1 = await queryHelper.queryPromise(sql1, [startNum, size],connection);
          // 更新学院下面的专业状态
          let sql2 = SQL.projectSQL.queryNum;
          let res2 = await queryHelper.queryPromise(sql2, null,connection);
        
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
 * 更新课程状态
 * @param {*} status 
 * @param {*} id 
 */
let updateProjectStatus = (status, id) => {
  let sql = SQL.projectSQL.updatedStatus;
  return queryHelper.queryPromise(sql, [status, id]);
}


/**
 * 查询项目，课程信息
 * @param {*} project_id 
 */
let queryById = (project_id) => {

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
          // 内容
          let sql1 = SQL.projectSQL.queryById;
          let res1 = await queryHelper.queryPromise(sql1, project_id,connection);
        
          // 课程内容
          let sql2 = 'select * from course where course_id = ?'
          let res2 = await queryHelper.queryPromise(sql2, res1.data[0].course_id,connection);

          let project = {
            ...res1.data
          }
          let course = {
            ...res2.data
          }
          let data = {
            project,
            course
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
 * @param {*} class_name 
 * @param {*} course_id 
 * @param {*} user_id 
 * @param {*} class_id 
 */
let updateProjectInfo = (project_name,project_content,target,course_id,project_id) => {
  let sql = SQL.projectSQL.updateProjectInfo;
  return queryHelper.queryPromise(sql, [project_name,project_content,target,course_id,project_id]);
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

                let status =  filter.status;
                filter['project.status'] = status;
                let isdelstatus = delete filter.status;
                let strBase = 'SELECT project_id, project_name, project_content, target, project.course_id, project.status, course_name FROM project inner join course on project.course_id = course.course_id where ';
                strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                let res1 = await queryHelper.queryPromise(strBase, null,connection);
              
                let strBase2 = 'select count(*) as number from project where ';
                strBase2 = strBase2 + util.obj2MySql(filter);
                let res2 = await queryHelper.queryPromise(strBase2, null,connection);
                await connection.commit()
                connection.release()
                resolve({
                    code: 200,
                    data: res1.data,
                    total:  res2.data[0].number,
                    
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
 *  根据courseID查询project
 * @param {*} course_id 
 */
let queryProByCourseID = (course_id) => {
  let sql = SQL.projectSQL.queryProByCourseID;
  return queryHelper.queryPromise(sql, course_id);
}
/**
 * 查询pro名称
 * @param {*} project_id 
 */
let queryByIdForName = (project_id) => {
  let sql = SQL.projectSQL.queryByIdForName;
  return queryHelper.queryPromise(sql, project_id);
}
let Dao = {
  insterProject,
  queryLimitProject,
  updateProjectStatus,
  queryById,
  updateProjectInfo,
  queryByFilter,
  queryProByCourseID,
  queryByIdForName
}
module.exports = Dao