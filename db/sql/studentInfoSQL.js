var UserSQL = {
        insert:'INSERT IGNORE INTO student(user_id,username,college_id,major_id,aclass_id) VALUES ?', 
        insertUser:'INSERT IGNORE INTO userInfo(user_id,username,password,email,telno,address,user_type_name,status) VALUES ?', 

        queryLimit: `SELECT student.user_id, student.username, email, telno, address, user_type_name, status, college_id,major_id,aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id limit ?, ?`,
        queryNum:'SELECT count(*) as number FROM student',

        query: 'SELECT student.user_id, student.username, email, telno, address, user_type_name, status, college_id,major_id,aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id ',

        queryById: 'SELECT student.user_id, student.username, email, telno, address, user_type_name, status, college_id,major_id,aclass_id FROM student inner join userInfo on student.user_id = userInfo.user_id  WHERE student.user_id= ?',

        updateStuInfo: `UPDATE student SET username = ?,college_id=?,major_id=?,aclass_id=? WHERE user_id = ?`,
        updateUserInfo: `UPDATE userInfo SET username = ?,email=?,telno=?,address=? WHERE user_id= ?`,

        queryByIdForName: 'SELECT username FROM student WHERE user_id= ?'
}
var SQL = {
    UserSQL,
}
module.exports = SQL;