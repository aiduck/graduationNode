const db = require('./DBConfig')

let queryPromise = function (sql, values, connection) {
  if (connection) {
    console.log('传进来一个connection!');
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        console.log(values);
        if (err) {
          reject({
            code: 0,
            msg: '操作数据库失败',
            results: err
          })
        }
        else {
          resolve({
            code: 200,
            msg: '操作数据库成功',
            data: results
          })
        }
      })
    })
  }
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        reject({
          code: 0,
          msg: '连接数据库失败',
          err: err
        })
      }
      else {
        connection.query(sql, values, (err, results) => {
          console.log(values);
          if (err) {
            connection.release()
            reject({
              code: 0,
              msg: '操作数据库失败',
              results: err
            })
          }
          else {
            connection.release()
            resolve({
              code: 200,
              msg: '操作数据库成功',
              data: results
            })
          }
        })
      }
    })
  })
}


let queryUtil = {
    queryPromise,
}
module.exports = queryUtil
  