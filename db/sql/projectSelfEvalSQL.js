var projectSelfEvalSQL = {

    querySelfByProId: 'select self_evaluation.user_id, username, self_evaluation.project_id, project_name from  self_evaluation, userInfo,project where self_evaluation.project_id = ? and self_evaluation.user_id = userInfo.user_id and self_evaluation.project_id = project.project_id',

    insert:'INSERT IGNORE INTO self_evaluation(id,tasks,workload,assessment,score,date,time,user_id,project_id) VALUES ?',

    // admin 可以查看所有的信息
    queryAll: 'SELECT id,tasks,workload,assessment,score,date,time,self_evaluation.project_id,self_evaluation.user_id, deadline from self_evaluation, project where project.project_id = self_evaluation.project_id limit ?, ?',
    queryAllNum: 'SELECT count(*) as number FROM self_evaluation',

    // student 查看参与的项目信息
    // report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id
    queryAllByStu: 'SELECT id,tasks,workload,assessment,score,date,time,self_evaluation.project_id,self_evaluation.user_id, deadline FROM self_evaluation,project where self_evaluation.user_id = ? and project.project_id = self_evaluation.project_id limit ?, ?',
    queryNumByStu: 'SELECT count(*) as number FROM self_evaluation where self_evaluation.user_id = ? ',
    // teacher 也只能查看参与的信息
    // report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id 
    queryAllByTea: 'SELECT id,tasks,workload,assessment,score,date,time,self_evaluation.project_id,self_evaluation.user_id,deadline  FROM self_evaluation, team, classes, project  where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = self_evaluation.project_id and project.project_id = self_evaluation.project_id limit ?, ?',
    queryNumByTea: 'SELECT count(*) as number FROM self_evaluation, team, classes where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = self_evaluation.project_id',
    
    deleteSelf: 'delete from self_evaluation where id = ?',



    // queryRepByIdNotStu: 'select daily_report.project_id, daily_report.user_id, report_id, report_date, report_time, report_work, report_problem, report_plan, report_status, report_comment, username, email, telno, address, project_name, project_content, target from daily_report, userInfo, project where daily_report.report_id = ? and daily_report.project_id = project.project_id and daily_report.user_id = userInfo.user_id',
    // queryRepByIdForStu: 'select daily_report.project_id, daily_report.user_id, report_id, report_date, report_time, report_work, report_problem, report_plan, report_status, report_comment, username, email, telno, address, project_name, project_content, target from  daily_report, userInfo, project, team, classes where daily_report.report_id = ? and  daily_report.project_id = project.project_id and team.project_id = daily_report.project_id and team.class_id = classes.class_id and classes.user_id = userInfo.user_id',
    querySelfById: 'select * from  self_evaluation where id = ?',


    updateSelf: 'UPDATE self_evaluation SET tasks=?,workload=?,assessment=?,score=?, date=?, time=? WHERE id= ?',

}
var SQL = {
    projectSelfEvalSQL,
}
module.exports = SQL;