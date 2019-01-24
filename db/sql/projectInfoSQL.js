var projectSQL = {
    insert:'INSERT IGNORE INTO project(project_id,project_name,project_content,target,course_id,status,is_choose,deadline) VALUES ?', 

    queryLimit: `SELECT project_id, project_name, project_content, target, project.course_id, project.status, is_choose, course_name, deadline FROM project inner join course on project.course_id = course.course_id limit ?, ?`,
    queryNum:'SELECT count(*) as number FROM project',

    updatedStatus: 'UPDATE project SET status = ? WHERE project_id= ?',

    queryById: 'SELECT * FROM project WHERE project_id= ?',

    updateProjectInfo: 'UPDATE project SET project_name=?,project_content=?,target=?,course_id=?,deadline=? WHERE project_id= ?',

    queryProByCourseID: `SELECT project_id,is_choose FROM project WHERE status='可用' and course_id= ?`,
    queryByIdForName: 'SELECT project_name FROM project WHERE project_id= ?'
}
var SQL = {
    projectSQL,
}
module.exports = SQL;