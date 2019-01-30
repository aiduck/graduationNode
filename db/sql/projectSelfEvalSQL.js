var projectSelfEvalSQL = {

    querySelfByProId: 'select self_evaluation.user_id, username, self_evaluation.project_id, project_name from  self_evaluation, userInfo,project where self_evaluation.project_id = ? and self_evaluation.user_id = userInfo.user_id and self_evaluation.project_id = project.project_id',

    insert:'INSERT IGNORE INTO self_evaluation(id,tasks,workload,assessment,score,date,time,user_id,project_id) VALUES ?',

    // admin 可以查看所有的信息
    queryAll: 'SELECT id,tasks,workload,assessment,score,date,time,self_evaluation.project_id,self_evaluation.user_id, deadline from self_evaluation, project where project.project_id = self_evaluation.project_id limit ?, ?',
    queryAllNum: 'SELECT count(*) as number FROM self_evaluation',

    // student 查看参与的项目信息

    queryAllByStu: 'SELECT id,tasks,workload,assessment,score,date,time,self_evaluation.project_id,self_evaluation.user_id, deadline FROM self_evaluation,project where self_evaluation.user_id = ? and project.project_id = self_evaluation.project_id limit ?, ?',
    queryNumByStu: 'SELECT count(*) as number FROM self_evaluation where self_evaluation.user_id = ? ',
    // teacher 也只能查看参与的信息

    queryAllByTea: 'SELECT id,tasks,workload,assessment,score,date,time,self_evaluation.project_id,self_evaluation.user_id,deadline  FROM self_evaluation, team, classes, project  where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = self_evaluation.project_id and project.project_id = self_evaluation.project_id limit ?, ?',
    queryNumByTea: 'SELECT count(*) as number FROM self_evaluation, team, classes where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = self_evaluation.project_id',
    
    deleteSelf: 'delete from self_evaluation where id = ?',


    querySelfById: 'select * from  self_evaluation where id = ?',


    updateSelf: 'UPDATE self_evaluation SET tasks=?,workload=?,assessment=?,score=?, date=?, time=? WHERE id= ?',

}
var SQL = {
    projectSelfEvalSQL,
}
module.exports = SQL;