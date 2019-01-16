var UserSQL = {
    insert:'INSERT IGNORE INTO userInfo(user_id,username,password,email,telno,address,user_type_name,status) VALUES ?', 
    insertTea:'INSERT IGNORE INTO teacher(user_id,username) VALUES ?', 
    insertStu:'INSERT IGNORE INTO student(user_id,username) VALUES ?', 

    
    query: 'SELECT user_id, username, email, telno, address, user_type_name, status FROM userInfo',
    queryLimit: 'SELECT user_id, username, email, telno, address, user_type_name, status FROM userInfo limit ?, ?',
    queryNum:'SELECT count(*) as number FROM userInfo',
    queryById: 'SELECT * FROM userInfo WHERE user_id= ?',


    updatedStatus: 'UPDATE userInfo SET status = ? WHERE user_id= ?',
    updatePwc: 'UPDATE userInfo SET password = 123456 WHERE user_id= ?',
    updateUserInfo: 'UPDATE userInfo SET username = ?,email=?,telno=?,address=?,user_type_name=? WHERE user_id= ?',
    updateTeaName: 'UPDATE teacher SET username = ? WHERE user_id= ?',
    updateStuName: 'UPDATE student SET username = ? WHERE user_id= ?',


    // login 用户登录接口
    login: 'SELECT * FROM userInfo WHERE user_id= ? and password = ?',
}
var SQL = {
    UserSQL,
}
module.exports = SQL;