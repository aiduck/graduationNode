var projectTeamSQL = {
    insert:'INSERT IGNORE INTO team(team_id,team_name,course_id,class_id,user_id,project_id) VALUES ?', 

    queryLimit: `SELECT team.team_id, team.team_name, team.course_id, team.class_id, team.user_id, team.project_id, course_name ,class_name, username, project_name FROM team, course, classes, student, project 
    where team.course_id = course.course_id and team.class_id = classes.class_id and team.user_id = student.user_id  and team.project_id = project.project_id  limit ?, ?`,
    queryNum:'SELECT count(*) as number FROM team',

    deleteTeam: 'delete from team where team_id = ?',
    deleteTeamAndMember: 'delete from team_members where team_id = ?',

    queryById: 'SELECT * FROM team WHERE team_id= ?',
    queryByProjectId: 'SELECT * FROM team WHERE project_id= ?',
    updateProjectTeamInfo: 'UPDATE team SET team_name=?,course_id=?,class_id=?,user_id=?,project_id=? WHERE team_id= ?',

    // 插入（删除）团队成员
    insertTeamMember: 'INSERT IGNORE INTO team_members(team_id,user_id) VALUES ?',
    deleteTeamMember: 'delete from team_members where team_id = ? and user_id = ?',
    // 同时插入（删除）成员成绩
    insertScore: 'INSERT IGNORE INTO score(user_id,project_id) VALUES ?',
    deleteScore: 'delete from score where user_id = ? and project_id = ?',

    // 获取学生参与的所有项目ID
    queryProIDByUserID: 'SELECT project.project_id, deadline FROM team, team_members, project where team_members.user_id = ? and team.team_id = team_members.team_id and team.project_id = project.project_id',
    // 获取一个team中所有用户
    queryAllTeamMembers: 'SELECT team_members.user_id,username,usual_performance,project_score,final_score,score.project_id from team_members,userInfo,score where team_members.team_id = ? and team_members.user_id = userInfo.user_id and team_members.user_id = score.user_id',
    // 获取自己所在team的信息
    queryOnlyTeamMember:  'SELECT team_members.user_id,username,usual_performance,project_score,final_score,score.project_id from team_members,userInfo,score where  team_members.team_id = ? and team_members.user_id = ? and team_members.user_id = userInfo.user_id and team_members.user_id = score.user_id ',
}
var SQL = {
    projectTeamSQL,
}
module.exports = SQL;