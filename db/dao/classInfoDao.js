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
          code: 500,
          msg: '获取数据库链接失败'
        })
      }
      else {
        try {
          await connection.beginTransaction()
          // 内容
          let sql1 = SQL.ClassSQL.queryLimit;
          let res1 = await queryHelper.queryPromise(sql1, [startNum, size]);
          // 数量
          let sql2 = SQL.ClassSQL.queryNum;
          let res2 = await queryHelper.queryPromise(sql2, null);
          // // 教师内容
          // let sql3 = 'select * from teacher where user_id = ?'
          // let res3 = await queryHelper.queryPromise(sql3, user_id);
          // // 课程内容
          // let sql4 = 'select * from course where course_id = ?'
          // let res4 = await queryHelper.queryPromise(sql4, course_id);

          // let data = {
          //   ...res1.data,
          //   ...res3.data,
          //   ...res4.data,
          // }
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
          code: 500,
          msg: '获取数据库链接失败'
        })
      }
      else {
        try {
          await connection.beginTransaction()
          // 内容
          let sql1 = SQL.ClassSQL.queryById;
          let res1 = await queryHelper.queryPromise(sql1, class_id);
          console.log(res1);
          // 教师内容
          let sql2 = 'select * from teacher where user_id = ?'
          let res2 = await queryHelper.queryPromise(sql2, res1.data[0].user_id);
          // 课程内容
          let sql3 = 'select * from course where course_id = ?'
          let res3 = await queryHelper.queryPromise(sql3, res1.data[0].course_id);

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
            data: data,
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
                code: 500,
                msg: '获取数据库链接失败'
            })
        }
        else {
            try {
                await connection.beginTransaction()
                let strBase = 'select * from classes where ';
                strBase = strBase + util.obj2MySql(filter) + `limit ${startNum},${size}`;
                let res1 = await queryHelper.queryPromise(strBase, null);
                
                let strBase2 = 'select count(*) as number from classes where ';
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


let Dao = {
  insterClass,
  queryLimitClass,
  updateClassStatus,
  queryById,
  updateClassInfo,
  queryByFilter,
  daleteClassList
}
module.exports = Dao