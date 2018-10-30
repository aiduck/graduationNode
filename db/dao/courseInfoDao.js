const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/courseInfoSQL');
const util = require('../../util/utils');


/**
 * 批量插入课程
 * @param {*数组} values 
 */
let insterCourse = (values) => {
    let sql = SQL.CourseSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}
/**
 * 搜索课程信息
 * @param {*} startNum 
 * @param {*} size 
 */
let queryLimitCourse = (startNum, size) => {

  return new Promise(async (resolve, reject) => {
    await db.getConnection(async (err, connection) => {
      if (err) {
        resolve({
          code: 500,
          msg: '获取数据库链接失败'
        })
      }
      else {
        try {
          await connection.beginTransaction()
          
          let sql1 = SQL.CourseSQL.queryLimit;
          let res1 = await queryHelper.queryPromise(sql1, [startNum, size]);
          // 更新学院下面的专业状态
          let sql2 = SQL.CourseSQL.queryNum;
          let res2 = await queryHelper.queryPromise(sql2, null);
        
          await connection.commit()
          connection.release()
          resolve({
            code: 200,
            data: res1.data,
            number: res2.data[0].number,
            msg: '查询成功'
          })
        }
        catch (error) {
          console.log('出错了，准备回滚', error)
          await connection.rollback(() => {
            console.log('回滚成功')
            connection.release()
          });
          resolve({
            code: 500,
            msg: '查询失败'
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
let updateCourseStatus = (status, id) => {
  let sql = SQL.CourseSQL.updatedStatus;
  return queryHelper.queryPromise(sql, [status, id]);
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
                code: 500,
                msg: '获取数据库链接失败'
            })
        }
        else {
            try {
                await connection.beginTransaction()
                let strBase = 'select * from course where ';
                strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                let res1 = await queryHelper.queryPromise(strBase, null);
                
                let strBase2 = 'select count(*) as number from course where ';
                strBase2 = strBase2 + util.obj2MySql(filter);
                let res2 = await queryHelper.queryPromise(strBase2, null);
                await connection.commit()
                connection.release()
                resolve({
                    code: 200,
                    data: res1.data,
                    total:  res2.data[0].number,
                    msg: '更改用户信息成功'
                })
            }
            catch (error) {
                console.log('出错了，准备回滚', error)
                await connection.rollback(() => {
                    console.log('回滚成功')
                    connection.release()
                });
                resolve({
                    code: 500,
                    msg: '更改用户信息失败'
                })
            }
        }
    })
})
}

/**
 * 查找特殊课程
 * @param {*} courseId 
 */
let queryCourseById = (courseId) => {
  let sql = SQL.CourseSQL.queryById;
  return queryHelper.queryPromise(sql, courseId);
}

/**
 * 更新课程
 * @param {*} course_name 
 * @param {*} year 
 * @param {*} term 
 * @param {*} hours 
 * @param {*} grade 
 * @param {*} college_id 
 * @param {*} major_id 
 * @param {*} ratio_usual 
 * @param {*} ratio_project 
 * @param {*} course_id 
 */
let updateCourseInfo = (course_name,year,term,hours,grade,college_id,major_id,ratio_usual,ratio_project,course_id) => {
  let sql = SQL.CourseSQL.updateCourseInfo;
  return queryHelper.queryPromise(sql, [course_name,year,term,hours,grade,college_id,major_id,ratio_usual,ratio_project,course_id]);
}

/**
 * 批量删除
 * @param {*} courseList 
 */
let daleteCourseList = (courseList) => {
  let sqlBase = `delete from course where course_id in (`;
  courseList.map((item, index) => {
      if(index < courseList.length - 1) {
          sqlBase = sqlBase +'\'' +item + '\','
      } else {
          sqlBase = sqlBase + '\''+ item + '\');'
      }
  })
  return queryHelper.queryPromise(sqlBase, null);
}
let Dao = {
  insterCourse,
  queryLimitCourse,
  updateCourseStatus,
  queryByFilter,
  queryCourseById,
  updateCourseInfo,
  daleteCourseList
}
module.exports = Dao