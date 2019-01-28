var projectAchiSQL = {
    insert:'INSERT IGNORE INTO delivery(delivery_id,title,submit_date,submit_time,project_id,user_id) VALUES ?',

    // admin 可以查看所有的信息
    queryAll: 'SELECT delivery_id,title,submit_date,submit_time,delivery.project_id,user_id,is_collect,deadline from delivery,project where project.project_id = delivery.project_id limit ?, ?',
    queryAllNum: 'SELECT count(*) as number FROM delivery',

    // student 查看参与的项目信息(和日报不一样的地方)
    // 日报是自己只能看自己的
    // 成果是小组内部成员都可以看的
    queryAllByStu: 'SELECT delivery_id,title,submit_date,submit_time,delivery.project_id,delivery.user_id,is_collect,deadline  FROM delivery, team, team_members,project where team_members.user_id = ? and team_members.team_id = team.team_id  and team.project_id = delivery.project_id and project.project_id = delivery.project_id limit ?, ?',
    queryNumByStu: 'SELECT count(*) as number FROM delivery, team, team_members where team_members.user_id = ? and team_members.team_id = team.team_id  and team.project_id = delivery.project_id',

    // teacher 也只能查看参与的信息
    queryAllByTea: 'SELECT delivery_id,title,submit_date,submit_time,delivery.project_id,delivery.user_id,is_collect,deadline  FROM delivery, team, classes,project where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = delivery.project_id and project.project_id = delivery.project_id limit ?, ?',
    queryNumByTea: 'SELECT count(*) as number FROM delivery, team, classes where classes.user_id = ? and classes.class_id = team.class_id  and team.project_id = delivery.project_id',

    // 通过project_id 查询项目成果的提交者姓名以及项目名称
    queryAchiByProId: 'select delivery.user_id, username, delivery.project_id, project_name from  delivery, userInfo,project where delivery.project_id = ? and delivery.user_id = userInfo.user_id and delivery.project_id = project.project_id',

    // 通过delivery_id 查询项目成果
    queryAchiById: 'select * from  delivery where delivery_id = ?',
    // 通过project_id 查询项目成果
    queryAchiByProIdAll: 'select * from  delivery where project_id = ?',
    // 更新项目成果信息
    updateAchi: 'UPDATE delivery SET title=?,submit_date=?,submit_time=?,project_id=?, user_id=? WHERE delivery_id= ?',
   
    // 收藏项目 获取取消收藏项目

    collectProjectCase: 'UPDATE delivery SET is_collect = ? where delivery_id= ?',
    insertProjectCase: 'INSERT IGNORE INTO project_case(date,project_id,course_id) VALUES ?',
    deleteProjectCase: 'delete from project_case where project_id = ?',

    // 项目收藏init
    queryAllCase: 'select id,date,project_case.project_id,project_case.course_id,project_name,course_name,classes.user_id from project_case,project,course,team,classes where project_case.project_id = team.project_id and team.class_id = classes.class_id and project_case.project_id = project.project_id and project_case.course_id = course.course_id  limit ?, ?',
    queryAllCaseNum: 'SELECT count(*) as number FROM project_case',
    // 项目收藏查询
    queryCaseById: 'select * from project_case where id = ?',

    // 取消项目收藏（在项目收藏里面的按钮)
    queryDelIdByProID: 'select delivery_id from delivery where project_id = ?',

    // 提交文件时，更行项目提交时间
    updateAchiByFile: 'UPDATE delivery SET submit_date=?,submit_time=? WHERE delivery_id= ?',
    // 文件插入
    saveAchifile:'INSERT INTO delivery_file(delivery_id,file_submit_date,file_submit_time,filename,filepath) VALUES ?',
    // 获取文件信息
    getAchifileList: 'select filename,filepath from delivery_file where delivery_id = ?',
    // 删除全部文件
    deleteAllAchifile: 'delete from delivery_file where delivery_id = ?',
    // 删除单个文件
    deleteAchifile: 'delete from delivery_file where delivery_id = ? and filepath = ? and filename = ?',


}
var SQL = {
    projectAchiSQL,
}
module.exports = SQL;