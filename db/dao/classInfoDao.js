const db = require('../../util/DBConfig');
const queryHelper = require('../../util/DBQuery');
const SQL = require('../sql/classInfoSQL');
const util = require('../../util/utils');


/**
 * 批量插入课程
 * @param {*数组} values 
 */
let insterClass = (values) => {
    let sql = SQL.ClassSQL.insert;
    return queryHelper.queryPromise(sql, [values]);
}

/**
 * 查询班级信息
 * @param {*} startNum 
 * @param {*} size 
 */
let queryLimitClass = (startNum, size) => {
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
          // 内容
          let sql1 = SQL.ClassSQL.queryLimit;
          let res1 = await queryHelper.queryPromise(sql1, [startNum, size],connection);
          // 数量
          let sql2 = SQL.ClassSQL.queryNum;
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
 * 更新状态
 * @param {*} status 
 * @param {*} class_id 
 */
let updateClassStatus = (status, class_id) => {
  let sql = SQL.ClassSQL.updatedStatus;
  return queryHelper.queryPromise(sql, [status, class_id]);
}

/**
 * 查询班级，课程，教师信息
 * @param {*} class_id 
 */
let queryById = (class_id) => {

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
          // 内容
          let sql1 = SQL.ClassSQL.queryById;
          let res1 = await queryHelper.queryPromise(sql1, class_id,connection);
          console.log(res1);
          // 教师内容
          let sql2 = 'select * from teacher where user_id = ?'
          let res2 = await queryHelper.queryPromise(sql2, res1.data[0].user_id,connection);
          // 课程内容
          let sql3 = 'select * from course where course_id = ?'
          let res3 = await queryHelper.queryPromise(sql3, res1.data[0].course_id,connection);

          let _class = {
            ...res1.data
          }
          let teacher = {
            ...res2.data
          }
          let course = {
            ...res3.data
          }
          let data = {
            _class,
            teacher,
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
let updateClassInfo = (class_name,course_id,user_id,class_id) => {
  let sql = SQL.ClassSQL.updateClassInfo;
  return queryHelper.queryPromise(sql, [class_name,course_id,user_id,class_id]);

}

/**
 * 筛选信息
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
            })
        }
        else {
            try {
                await connection.beginTransaction()
                let strBase = 'select * from classes where ';
                strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                let res1 = await queryHelper.queryPromise(strBase, null,connection);
                
                let strBase2 = 'select count(*) as number from classes where ';
                strBase2 = strBase2 + util.obj2MySql(filter);
                let res2 = await queryHelper.queryPromise(strBase2, null,connection);
                await connection.commit()
                connection.release()
                resolve({
                    code: 200,
                    msg: '更改用户信息成功',
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
 * 删除信息
 * @param {*} classIdList 
 */
let daleteClassList = (classIdList) => {
  let sqlBase = `delete from classes where class_id in (`;
  classIdList.map((item, index) => {
      if(index < classIdList.length - 1) {
          sqlBase = sqlBase +'\'' +item + '\','
      } else {
          sqlBase = sqlBase + '\''+ item + '\');'
      }
  })
  return queryHelper.queryPromise(sqlBase, null);
}


/**
 * 批量插入班级成员
 * @param {*} values 
 */
let insterClassMemeber = (values) => {
  let sql = SQL.ClassSQL.insertMember;
  return queryHelper.queryPromise(sql, [values]);
}

/**
 * 查询班级成员表格信息
 * @param {*} startNum 
 * @param {*} size 
 */
let queryLimitClassMemeber = (startNum, size) => {

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
          
          let sql1 = SQL.ClassSQL.queryLimitMember;
          let res1 = await queryHelper.queryPromise(sql1, [startNum, size],connection);
          // 更新学院下面的专业状态
          let sql2 = SQL.ClassSQL.queryNumMember;
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
 * 筛选班级成员信息
 * @param {*} filter 
 * @param {*} startNum 
 * @param {*} size 
 */
let queryByFilterMemeber = (filter,startNum,size) => {
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
                let strBase = 'select * from classMemeber where ';
                strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                let res1 = await queryHelper.queryPromise(strBase, null,connection);
                
                let strBase2 = 'select count(*) as number from classMemeber where ';
                strBase2 = strBase2 + util.obj2MySql(filter);
                let res2 = await queryHelper.queryPromise(strBase2, null,connection);
                await connection.commit()
                connection.release()
                resolve({
                    code: 200,
                    msg: '更改用户信息成功',
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
 * 删除版级成员信息
 * @param {*} classIdList 
 */
let daleteClassMemeberList = (classIdList) => {
  let sqlBase = `delete from classMemeber where id in (`;
  classIdList.map((item, index) => {
      if(index < classIdList.length - 1) {
          sqlBase = sqlBase +'\'' +item + '\','
      } else {
          sqlBase = sqlBase + '\''+ item + '\');'
      }
  })
  return queryHelper.queryPromise(sqlBase, null);
}

/**
 * 导出班级成员
 */
let queryAllClassMemeber = () => {
  let sql = SQL.ClassSQL.queryAllClassMemeber;
  return queryHelper.queryPromise(sql, null);
}

/**
 * 导出班级成员筛选
 * @param {*} filter 
 */
let queryAllClassMemeberFilter = (filter) => {
  let strBase = 'select * from classMemeber where ';
  strBase = strBase + util.obj2MySql(filter);
  return queryHelper.queryPromise(strBase, null);
}

/**
 * 获取所有课程信息
 */
let queryAll = () => {
  let sql = SQL.ClassSQL.queryAll;
  return queryHelper.queryPromise(sql,null);
}

/**
 * 获取班级名称
 * @param {*} class_id 
 */
let queryByIdForName = (class_id) => {
  let sql = SQL.ClassSQL.queryByIdForName;
  
  return queryHelper.queryPromise(sql, class_id);
}
/**
 * 获取某个班级所有学生的id
 * @param {*} class_id 
 */
let queryStuByClassId = (class_id) => {
  let sql = SQL.ClassSQL.queryStuByClassId;
  return queryHelper.queryPromise(sql, class_id);
}

let Dao = {
  insterClass,
  queryLimitClass,
  updateClassStatus,
  queryById,
  updateClassInfo,
  queryByFilter,
  daleteClassList,

  insterClassMemeber,
  queryLimitClassMemeber,
  queryByFilterMemeber,
  daleteClassMemeberList,
  queryAllClassMemeber,
  queryAllClassMemeberFilter,

  queryAll,
  queryByIdForName,
  queryStuByClassId
}
module.exports = Dao