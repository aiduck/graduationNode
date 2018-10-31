var ClassSQL = {
    insert:'INSERT IGNORE INTO classes(class_id,class_name,course_id,user_id,status) VALUES ?', 

    queryLimit: 'SELECT * FROM classes limit ?, ?',
    queryNum:'SELECT count(*) as number FROM classes',
    updatedStatus: 'UPDATE classes SET status = ? WHERE class_id= ?',
    queryById: 'SELECT * FROM classes WHERE class_id= ?',
    updateClassInfo: 'UPDATE classes SET class_name = ?,course_id=?,user_id=? WHERE class_id= ?'
}
var SQL = {
    ClassSQL,
}
module.exports = SQL;