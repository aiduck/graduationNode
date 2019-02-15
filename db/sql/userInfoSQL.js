var UserSQL = {
    insert:'INSERT IGNORE INTO userInfo(user_id,username,password,email,telno,address,user_type_name,status) VALUES ?', 
    insertTea:'INSERT IGNORE INTO teacher(user_id,username) VALUES ?', 
    insertStu:'INSERT IGNORE INTO student(user_id,username) VALUES ?', 

    
    query: 'SELECT user_id, username, email, telno, address, user_type_name, status FROM userInfo',
    queryLimit: 'SELECT user_id, username, email, telno, address, user_type_name, status FROM userInfo limit ?, ?',
    queryNum:'SELECT count(*) as number FROM userInfo',
    queryById: 'SELECT user_id, username, email, telno, address, user_type_name, status FROM userInfo WHERE user_id= ?',


    updatedStatus: 'UPDATE userInfo SET status = ? WHERE user_id= ?',
    updatePwc: 'UPDATE userInfo SET password = 123456 WHERE user_id= ?',
    updateUserInfo: 'UPDATE userInfo SET username = ?,email=?,telno=?,address=?,user_type_name=? WHERE user_id= ?',
    updateTeaName: 'UPDATE teacher SET username = ? WHERE user_id= ?',
    updateStuName: 'UPDATE student SET username = ? WHERE user_id= ?',


    // login 用户登录接口
    login: 'SELECT * FROM userInfo WHERE user_id= ? and password = ?',
    // 验证用户ID 和登录的用户名是一致的
    checkUserId: 'SELECT username FROM userInfo WHERE user_id= ?',
    // 上传用户头像
    saveUserImgfile: 'UPDATE userInfo SET imgUrl = ? WHERE user_id= ? ',
    // 个人中心用户信息查询
    queryByIdPwd: 'SELECT user_id, username,user_type_name, email, telno, address,imgUrl,password FROM userInfo WHERE user_id= ?',
    queryByIdForStu: 'SELECT userInfo.user_id,userInfo.username,user_type_name,email,password,telno,address,imgUrl,college_id,major_id,aclass_id FROM userInfo,student WHERE userInfo.user_id= ? and userInfo.user_id = student.user_id ',
    queryByIdForTea: 'SELECT userInfo.user_id,userInfo.username,user_type_name,email,password,telno,address,imgUrl,sex,job_title,education FROM userInfo,teacher WHERE userInfo.user_id= ? and userInfo.user_id = teacher.user_id ',
    // 更新用户个人中心数据
    updateUser:'UPDATE userInfo SET username = ?,email=?,telno=?,address=?,password=? WHERE user_id= ?',
    updateUserStu: 'UPDATE student SET college_id = ?,major_id=?,aclass_id=? WHERE user_id= ?',
    updateUserTea: 'UPDATE teacher SET sex = ?,job_title=?,education=? WHERE user_id= ?',

    // 个人技能查询
    querySkill: 'select * from skill',
    insertUpdateSkill: 'INSERT INTO skill (skill_name,skill_num) VALUES ? ON DUPLICATE KEY UPDATE skill_num=VALUES(skill_num);'
}
var SQL = {
    UserSQL,
}
module.exports = SQL;