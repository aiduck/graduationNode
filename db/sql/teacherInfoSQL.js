var UserSQL = {
        insert:'INSERT IGNORE INTO teacher(user_id,username,sex,job_title,education) VALUES ?', 
        insertUser:'INSERT IGNORE INTO userInfo(user_id,username,password,email,telno,address,user_type_name,status) VALUES ?', 

        queryLimit: `SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id limit ?, ?`,
        queryNum:'SELECT count(*) as number FROM teacher',

        query: 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id ',


        queryById: 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE teacher.user_id= ?',
        // 班级信息中的获取教师姓名
        queryByIdForName: 'SELECT username from teacher  WHERE user_id= ?',

        updateTeaInfo: `UPDATE teacher SET username = ?,sex=?,job_title=?,education=? WHERE user_id = ?`,
        updateUserInfo: `UPDATE userInfo SET username = ?,email=?,telno=?,address=? WHERE user_id= ?`,

        queryAllTeaId: 'SELECT user_id,status from userInfo where user_type_name = "教师" ',
}
var SQL = {
    UserSQL,
}
module.exports = SQL;