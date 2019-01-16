
// const whiteListUrl = require('../config/whiteList');
// const utils = require('../../util/utils');
var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块
const jwt = require('jsonwebtoken');

// const auth = (req,res,next) => {
//     const method = req.method.toLowerCase() // 获取请求方法
//     const path = req.path // 获取请求的路径
//     // 判断是不是在白名单中
//     if (whiteListUrl[method] && utils.hasOneOf(path, whiteListUrl[method])) {
//         next()
//     } else {
//         jwt.verify(token, 'yhcj(这里填的是你的加密密钥，可以读取文件，或者可以这样瞎写一段)',(error, decode)=>{
//             if(error) {
//                 res.json({
//                     code: 401,
//                     mes: 'token error',
//                     data: {}
//                 })
//             }
//             else {
//                 console.log(decode['usertype']);
//                 console.log(decode['username']);
//                 next()
//             }
//         })
//     }
// }

const authRouteList = (req,res,next) => {
    let params = req.query;
    let token = params.token;
    let usertype;
    let file;
    jwt.verify(token, 'yhcj(这里填的是你的加密密钥，可以读取文件，或者可以这样瞎写一段)',(error, decode)=>{
        console.log(error)
        if(error) {
            res.send({
                code: 401,
                mes: 'token error',
                data: {}
            })
        }
        else {
            console.log(decode['usertype']);
            console.log(decode['username']);
            usertype = decode['usertype'] 
            if(usertype === '管理员') {
                file = path.join(__dirname, '../../config/admin.json'); //文件路径，__dirname为当前运行js文件的目录
            } else if(usertype === '教师') {
                file = path.join(__dirname, '../../config/teacher.json');
            } else if(usertype === '学生') {
                file = path.join(__dirname, '../../config/student.json');
            }
            //读取json文件
            fs.readFile(file, 'utf-8', function(err, data) {
                if (err) {
                    res.send('文件读取失败');
                } else {
                    res.send(data);
                }
            });
        }
    })
    
}

let controller = {
    authRouteList
    // auth
}
module.exports = controller