var ClassSQL = {
    insert:'INSERT IGNORE INTO classes(class_id,class_name,course_id,user_id,status) VALUES ?', 

    queryLimit: 'SELECT * FROM classes limit ?, ?',
    queryNum:'SELECT count(*) as number FROM classes',
    queryAllByTea: 'SELECT * FROM classes where user_id = ? limit ?, ?',
    queryNumByTea: 'SELECT count(*) as number FROM classes where user_id = ?',
    queryAllByStu: 'SELECT classes.class_id, classes.class_name,classes.course_id,classes.user_id,classes.status FROM classes, classMemeber where classMemeber.user_id = ? and classMemeber.class_id = classes.class_id  limit ?, ?',
    queryNumByStu: 'SELECT count(*) as number FROM classes,classMemeber where classMemeber.user_id = ? and classMemeber.class_id = classes.class_id ',


    updatedStatus: 'UPDATE classes SET status = ? WHERE class_id= ?',
    queryById: 'SELECT * FROM classes WHERE class_id= ?',
    updateClassInfo: 'UPDATE classes SET class_name = ?,course_id=?,user_id=? WHERE class_id= ?',

    insertMember:'INSERT IGNORE INTO classMemeber(user_id,username,class_id,class_name) VALUES ?',
    queryLimitMember: `SELECT * FROM classMemeber limit ?, ?`,
    queryNumMember:'SELECT count(*) as number FROM classMemeber', 
    queryAllClassMemeber: `SELECT * FROM classMemeber`,

    queryAll: `SELECT class_id,status FROM classes`,
    // 班级信息中的获取课程名称
    queryByIdForName: 'SELECT class_name,course_id FROM classes WHERE class_id = ?',
    queryStuByClassId: 'SELECT user_id FROM classMemeber where class_id = ?',
    queryAllByCourse: 'SELECT class_id,status FROM classes where course_id = ?'
}
var SQL = {
    ClassSQL,
}
module.exports = SQL;