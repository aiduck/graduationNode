var ClassSQL = {
    insert:'INSERT IGNORE INTO classes(class_id,class_name,course_id,user_id,status) VALUES ?', 

    queryLimit: 'SELECT * FROM classes limit ?, ?',
    queryNum:'SELECT count(*) as number FROM classes',
    updatedStatus: 'UPDATE classes SET status = ? WHERE class_id= ?',
    queryById: 'SELECT * FROM classes WHERE class_id= ?',
    updateClassInfo: 'UPDATE classes SET class_name = ?,course_id=?,user_id=? WHERE class_id= ?',

    insertMember:'INSERT IGNORE INTO classMemeber(user_id,username,class_id,class_name) VALUES ?',
    queryLimitMember: `SELECT * FROM classMemeber limit ?, ?`,
    queryNumMember:'SELECT count(*) as number FROM classMemeber', 
    queryAllClassMemeber: `SELECT * FROM classMemeber`
}
var SQL = {
    ClassSQL,
}
module.exports = SQL;