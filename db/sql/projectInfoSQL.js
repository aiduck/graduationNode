var projectSQL = {
    insert:'INSERT IGNORE INTO project(project_id,project_name,project_content,target,course_id,status) VALUES ?', 

    queryLimit: `SELECT project_id, project_name, project_content, target, project.course_id, project.status, course_name FROM project inner join course on project.course_id = course.course_id limit ?, ?`,
    queryNum:'SELECT count(*) as number FROM project',

    updatedStatus: 'UPDATE project SET status = ? WHERE project_id= ?',

    queryById: 'SELECT * FROM project WHERE project_id= ?',

    updateProjectInfo: 'UPDATE project SET project_name=?,project_content=?,target=?,course_id=? WHERE project_id= ?',
}
var SQL = {
    projectSQL,
}
module.exports = SQL;