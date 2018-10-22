var UserSQL = {
        insert:'INSERT IGNORE INTO teacher(user_id,username,sex,job_title,education) VALUES ?', 
        insertUser:'INSERT IGNORE INTO userInfo(user_id,username,password,email,telno,address,user_type_name,status) VALUES ?', 

        queryLimit: `SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id limit ?, ?`,
        queryNum:'SELECT count(*) as number FROM teacher',

        query: 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id ',


        queryById: 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE teacher.user_id= ?',

        updateTeaInfo: `UPDATE teacher SET username = ?,sex=?,job_title=?,education=? WHERE user_id = ?`,
        updateUserInfo: `UPDATE userInfo SET username = ?,email=?,telno=?,address=? WHERE user_id= ?`,
}
var SQL = {
    UserSQL,
}
module.exports = SQL;