var projectTeamSQL = {
    insert:'INSERT IGNORE INTO team(team_id,team_name,class_id,user_id,project_id) VALUES ?', 

    queryLimit: `SELECT team.team_id, team.team_name, team.class_id, team.user_id, team.project_id, class_name, username, project_name FROM team, classes, student, project 
    where team.class_id = classes.class_id and team.user_id = student.user_id  and team.project_id = project.project_id  limit ?, ?`,
    queryNum:'SELECT count(*) as number FROM team',

    deleteTeam: 'delete from team where team_id = ?',
    deleteTeamAndMember: 'delete from team_members where team_id = ?',

    queryById: 'SELECT * FROM team WHERE team_id= ?',
    updateProjectTeamInfo: 'UPDATE team SET team_name=?,class_id=?,user_id=?,project_id=? WHERE team_id= ?',

    insertTeamMember: 'INSERT IGNORE INTO team_members(team_id,user_id) VALUES ?',
    deleteTeamMember: 'delete from team_members where team_id = ? and user_id = ?'
}
var SQL = {
    projectTeamSQL,
}
module.exports = SQL;