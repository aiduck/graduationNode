var UserSQL = {
        insert:'INSERT IGNORE INTO student(user_id,username,aclass_id) VALUES ?', 
        insertUser:'INSERT IGNORE INTO userInfo(user_id,username,password,email,telno,address,user_type_name,status) VALUES ?', 

        queryLimit: `SELECT student.user_id, student.username, email, telno, address, user_type_name, status, aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id limit ?, ?`,
        queryNum:'SELECT count(*) as number FROM student',

        query: 'SELECT student.user_id, student.username, email, telno, address, user_type_name, status, aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id ',

        queryById: 'SELECT student.user_id, student.username, email, telno, address, user_type_name, status, aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id  WHERE student.user_id= ?',

        updateStuInfo: `UPDATE student SET username = ?,aclass_id=? WHERE user_id = ?`,
        updateUserInfo: `UPDATE userInfo SET username = ?,email=?,telno=?,address=? WHERE user_id= ?`,
}
var SQL = {
    UserSQL,
}
module.exports = SQL;