var CollegeSQL = {
    insert:'INSERT INTO college(college_id,college_name,status) VALUES ?', 
    queryNum:'SELECT count(*) as count FROM college',
    query:'SELECT * FROM college',
}
var MajorSQL = {
    insert:'INSERT INTO major(major_id,major_name,college_id,status) VALUES ?', 
    getMajorById:'SELECT * FROM major WHERE college_id= ?',
}
var AdClassSQL = {
    insert:'INSERT INTO adclass(aclass_id,major_id,aclass_name,grade,status) VALUES ?', 
    getClassById:'SELECT * FROM adclass WHERE major_id = ? ',
}

var SQL = {
    CollegeSQL,
    MajorSQL,
    AdClassSQL
}
module.exports = SQL;