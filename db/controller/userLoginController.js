const jwt = require('jsonwebtoken')
const config  = require('../../config')
const userInfoDao = require('../dao/userInfoDao')


// 查询所有用户信息（导出）
let login =  async(req, res, next) => {
    try {
        let params = req.query;
        let username = params.username;
        let password = params.password;
        let login = await userInfoDao.login(username,password);

        if(login.code === 200) {
            if(login.data.length === 0) {
                res.send({
                    code: 401,
                    msg: 'user name or password is wrong',
                })  
            } else  if(login.data.length === 1) {
                let data = {
                    token: jwt.sign({ username: username, usertype: login.data[0].user_type_name  }, 'yhcj(这里填的是你的加密密钥，可以读取文件，或者可以这样瞎写一段)', { expiresIn: config.TOKEN_MAX_TIME }),
                    usertype: login.data[0].user_type_name,
                    username: login.data[0].username,
                    user_id: login.data[0].user_id,
                }
                res.send({
                    code: 200,
                    data: data,
                    msg: 'success'
                })
            }
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败',
            })
        }
    }
    catch (err) {
        console.log(err);
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}


/* 重新生成token，用来给用户续时间 */
let authorization = (req,res) => { 
    let params = req.query;
    let username = params.username;
    let usertype = params.usertype;
    try {
        if(usertype !== '' && username !== '') {
            let data = {
                token: jwt.sign({ username: username, usertype: usertype }, 'yhcj(这里填的是你的加密密钥，可以读取文件，或者可以这样瞎写一段)', { expiresIn: config.TOKEN_MAX_TIME }),
            }
            res.send({
                code: 200,
                data: data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败',
            })
        }
    }
    catch (err) {
        console.log(err);
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

let controller = {
    login,
    authorization
}
module.exports = controller