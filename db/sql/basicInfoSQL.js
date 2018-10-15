var CollegeSQL = {
    insert:'INSERT IGNORE INTO college(college_id,status) VALUES ?', 
    queryStatus: 'SELECT status FROM college WHERE college_id = ?',
    query:'SELECT * FROM college',
   
}
var MajorSQL = {
    insert:'INSERT IGNORE INTO major(major_id,college_id,status) VALUES ?', 
    getMajorById:'SELECT * FROM major WHERE college_id= ?',

}
var AdClassSQL = {
    insert:'INSERT IGNORE INTO adclass(aclass_id,major_id) VALUES ?', 
    getClassById:'SELECT * FROM adclass WHERE major_id = ?',

}

var StatueSQL = {
    updateColStatue:'UPDATE college SET status = ? WHERE college_id= ?',
    updateMajStatue:'UPDATE major SET status = ? WHERE major_id= ?',
    updateAllMajSta:'UPDATE major SET status = ? WHERE college_id= ?'
}

var DelSQL = {
    delAdclass: 'DELETE FROM adclass WHERE major_id = ? and aclass_id = ?'
}

var AddSAL = {
    addCollege: 'INSERT INTO college(college_id,status) VALUES ?',
    addMajor: 'INSERT INTO major(major_id,college_id,status) VALUES ?',
    addAdclass: 'INSERT INTO adclass(aclass_id,major_id) VALUES ?'
}
var SQL = {
    CollegeSQL,
    MajorSQL,
    AdClassSQL,
    StatueSQL,
    DelSQL,
    AddSAL
}
module.exports = SQL;