var CourseSQL = {
    insert:'INSERT IGNORE INTO course(course_id,course_name,year,term,hours,grade,college_id,major_id,ratio_usual,ratio_project,status) VALUES ?', 

    queryLimit: `SELECT * FROM course limit ?, ?`,
    queryNum:'SELECT count(*) as number FROM course',
    queryById: 'SELECT * FROM course WHERE course_id= ?',
    
    updatedStatus: 'UPDATE course SET status = ? WHERE course_id= ?',
    updateCourseInfo: 'UPDATE course SET course_name = ?,year=?,term=?,hours=?,grade=?,college_id=?,major_id=?,ratio_usual=?,ratio_project=? WHERE course_id= ?',
}
var SQL = {
    CourseSQL,

}
module.exports = SQL;