var UserSQL = {
    insert:'INSERT IGNORE INTO teacher(user_id,username,sex,job_title,education) VALUES ?', 
    
    queryLimit: `SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id limit ?, ?`,
    queryNum:'SELECT count(*) as number FROM teacher',

    query: 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id ',


    queryById: 'SELECT teacher.user_id, teacher.username, email, telno, address, user_type_name, status, sex, job_title, education FROM teacher inner join userInfo on teacher.user_id = userInfo.user_id  WHERE teacher.user_id= ?',

    updateUserInfo: `UPDATE userInfo, teacher SET 
        userInfo.username = ?,
        userInfo.email=?,
        userInfo.telno=?,
        userInfo.address=?,
        userInfo.user_type_name=?,
        teacher.sex=?,
        teacher.job_title=?,
        teacher.education=?
        WHERE teacher.user_id = userInfo.user_id and userInfo.user_id = ?`,
}
var SQL = {
    UserSQL,
}
module.exports = SQL;