var projectReportSQL = {

    queryRepByProId: 'select daily_report.user_id, username, daily_report.project_id, project_name from  daily_report, userInfo,project where daily_report.project_id = ? and daily_report.user_id = userInfo.user_id and daily_report.project_id = project.project_id',

    insert:'INSERT IGNORE INTO daily_report(report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,project_id,user_id) VALUES ?',

    // admin 可以查看所有的信息
    queryAll: 'SELECT report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id, deadline from daily_report, project where project.project_id = daily_report.project_id limit ?, ?',
    queryAllNum: 'SELECT count(*) as number FROM daily_report',

    // student 查看参与的项目信息
    // report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id
    queryAllByStu: 'SELECT report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id, deadline FROM daily_report,project where daily_report.user_id = ? and project.project_id = daily_report.project_id limit ?, ?',
    queryNumByStu: 'SELECT count(*) as number FROM daily_report where daily_report.user_id = ? ',
    // teacher 也只能查看参与的信息
    // report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id 
    queryAllByTea: 'SELECT report_id,report_date,report_time,report_work,report_problem,report_plan,report_status,report_comment,daily_report.project_id,daily_report.user_id,deadline  FROM daily_report, team, classes, project  where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = daily_report.project_id and project.project_id = daily_report.project_id limit ?, ?',
    queryNumByTea: 'SELECT count(*) as number FROM daily_report, team, classes where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = daily_report.project_id',

    // queryRepByIdNotStu: 'select daily_report.project_id, daily_report.user_id, report_id, report_date, report_time, report_work, report_problem, report_plan, report_status, report_comment, username, email, telno, address, project_name, project_content, target from daily_report, userInfo, project where daily_report.report_id = ? and daily_report.project_id = project.project_id and daily_report.user_id = userInfo.user_id',
    // queryRepByIdForStu: 'select daily_report.project_id, daily_report.user_id, report_id, report_date, report_time, report_work, report_problem, report_plan, report_status, report_comment, username, email, telno, address, project_name, project_content, target from  daily_report, userInfo, project, team, classes where daily_report.report_id = ? and  daily_report.project_id = project.project_id and team.project_id = daily_report.project_id and team.class_id = classes.class_id and classes.user_id = userInfo.user_id',
    queryRepById: 'select * from  daily_report where report_id = ?',

    updateReportByStu: 'UPDATE daily_report SET report_date=?,report_time=?,report_work=?,report_problem=?, report_plan=? WHERE report_id= ?',
    updateReportByTea: 'UPDATE daily_report SET report_status=?,report_comment=? WHERE report_id= ?',

    deleteReport: 'delete from daily_report where report_id = ?',
}
var SQL = {
    projectReportSQL,
}
module.exports = SQL;