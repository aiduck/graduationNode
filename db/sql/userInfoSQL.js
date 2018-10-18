var UserSQL = {
    insert:'INSERT IGNORE INTO userInfo(user_id,username,password,email,telno,address,user_type_name,status) VALUES ?', 
    
    query: 'SELECT user_id, username, email, telno, address, user_type_name, status FROM userInfo',
    queryLimit: 'SELECT user_id, username, email, telno, address, user_type_name, status FROM userInfo limit ?, ?',
    queryNum:'SELECT count(*) as number FROM userInfo',
    queryById: 'SELECT * FROM userInfo WHERE user_id= ?',


    updatedStatus: 'UPDATE userInfo SET status = ? WHERE user_id= ?',
    updatePwc: 'UPDATE userInfo SET password = 123456 WHERE user_id= ?',
    updateUserInfo: 'UPDATE userInfo SET username = ?,email=?,telno=?,address=?,user_type_name=? WHERE user_id= ?',
}
var SQL = {
    UserSQL,
}
module.exports = SQL;