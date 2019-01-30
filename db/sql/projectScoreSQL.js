var projectScoreSQL = {

    queryAll: 'select project.project_id,project.project_name,course.course_id,course.course_name,course.ratio_usual,course.ratio_project,team.team_id,team.user_id from team,project,course where team.project_id = project.project_id and team.course_id = course.course_id limit ?,?',
    queryNum: 'SELECT count(*) as number from team',

    queryAllByStu: 'select project.project_id,project.project_name,course.course_id,course.course_name,course.ratio_usual,course.ratio_project,team.team_id,team.user_id from team_members, team, project,course where team_members.user_id = ? and team_members.team_id = team.team_id and team.project_id = project.project_id and team.course_id = course.course_id limit ?,?',
    queryAllByStuNum: 'SELECT count(*) as number from team_members where team_members.user_id = ?',


    queryAllByTea: 'select project.project_id,project.project_name,course.course_id,course.course_name,course.ratio_usual,course.ratio_project,team.team_id,team.user_id from classes,team,project,course where classes.user_id = ? and classes.class_id = team.class_id and team.project_id = project.project_id and team.course_id = course.course_id limit ?,?',
    queryAllByTeaNum: 'SELECT count(*) as number from classes,team where classes.user_id = ? and classes.class_id = team.class_id',


    updateScore: 'UPDATE score SET usual_performance=?,project_score=?,final_score=? WHERE user_id= ? and project_id=?',

}
var SQL = {
    projectScoreSQL,
}
module.exports = SQL;