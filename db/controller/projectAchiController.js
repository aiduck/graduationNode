const projectAchiDao = require('../dao/projectAchiDao')
const utils = require('../../util/utils')

// 添加记录前查询是否小组成员已经添加了信息
let queryAchiByProId = async (req, res, next) => {
    let project_id = req.body.project_id;
    console.log(project_id);
    try {
        let  projectAchiPro = await projectAchiDao.queryAchiByProId(project_id);
        if(projectAchiPro.code === 200) {
            if(projectAchiPro.data) {
                res.send({
                    code: 200,
                    data: projectAchiPro.data,
                    msg: 'success'
                })
            } else {
                res.send({
                    code: 200,
                    data: [],
                    msg: 'success'
                })
            }
            
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}


// 添加项目日报
let inster = async (req, res, next) => {
    let projectAchi = req.body;
    let values = [];
    let delivery_id = utils.getId('achiId');

    let value = [`${delivery_id}`,`${projectAchi.title}`,
    `${projectAchi.submit_date}`,`${projectAchi.submit_time}`,
    `${projectAchi.project_id}`,`${projectAchi.user_id}`];
    values.push(value);
    try {
        let  projectAchiPro = await projectAchiDao.insterProjectAchi(values);
        if(projectAchiPro.code === 200) {
            res.send({
                code: 200,
                data: '',
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}


// 用户查询列表接口
let queryprojectAchiList =  async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;
    let usertype = params.usertype;
    let user_id = params.user_id;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let reportPro = await projectAchiDao.queryprojectAchiList(user_id,usertype,startNum,size);
        if(reportPro.code === 200) {
            let data = {
                projectAchiList: reportPro.data,
                total: reportPro.number
            }
            res.send({
                code: 200,
                data: data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        console.log(err);
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 查询详细信息接口
let queryprojectAchiDetil = async(req, res, next) => {
    let delivery_id = req.body.delivery_id;
    try {
        let  projectPro = await projectAchiDao.queryprojectAchiDetil(delivery_id);
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: projectPro.data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 更新成果信息（单纯更新成果信息）
let updateprojectAchi = async(req, res, next) => {
    let projectAchi = req.body.form;
    try { 
        let  projectAchiPro = await projectAchiDao.updateprojectAchi(
            projectAchi.title,
            projectAchi.submit_date,
            projectAchi.submit_time,
            projectAchi.project_id,
            projectAchi.user_id,
            projectAchi.delivery_id);
        if(projectAchiPro.code === 200) {
            res.send({
                code: 200,
                data: [],
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 文件上传
let saveAchifile = async (req, res, next) =>{
    const file = req.file
    var values = [];
    let value = [`${req.body.delivery_id}`,`${req.body.file_submit_date}`,`${req.body.file_submit_time}`,`${file.originalname}`,`${file.path}`];
    values.push(value);
    try {
        let filePro = await projectAchiDao.saveAchifile(values,req.body.file_submit_date,req.body.file_submit_time,req.body.delivery_id);
       if(filePro.code === 200) {
            res.send({
                code: 200,
                data: [],
                msg: 'success'
            })
        } else {
            utils.deleteFile('/Users/yanghechenji/Desktop/毕设/code/node/public/uploads/fileDemo/',`${file.originalname}`);
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 获取文件list
let getAchifileList = async(req, res, next) => {
    let delivery_id = req.body.delivery_id;
    try {
        let  projectPro = await projectAchiDao.getAchifileList(delivery_id);
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: projectPro.data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}


// 删除所有文件
let deleteAllAchifile =  async(req, res, next) => {
    let delivery_id = req.body.delivery_id;
    try {
        let  projectPro = await projectAchiDao.deleteAllAchifile(delivery_id);
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: [],
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 删除所有文件
let deleteAchifile =  async(req, res, next) => {
    let delivery_id = req.body.delivery_id;
    let filename = req.body.filename;
    let filepath = req.body.filepath;
    try {
        let  projectPro = await projectAchiDao.deleteAchifile(delivery_id,filepath,filename);
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: [],
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 筛选项目成果
let queryByFilter = async(req, res, next) => {
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await projectAchiDao.queryByFilter(filter,startNum,size);
        if(filterPro.code === 200) {
            let data = {
                achiList: filterPro.data,
                total:  filterPro.total
            }
            res.send({
                code: 200,
                data: data,
                msg: 'success'
            });
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch(err) {
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}

// 收藏
let collectProjectCase = async(req, res, next) => {
    let is_collect = req.body.is_collect;
    let delivery_id = req.body.delivery_id;
    let projectObj = req.body.projectObj;
    console.log(is_collect,delivery_id,projectObj);
    try {
        let  projectPro = await projectAchiDao.collectProjectCase(is_collect,delivery_id,projectObj);
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: [],
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// init 项目收藏table_list
let queryAllCase = async(req, res, next) => {
    let params = req.query;
    let pageSize = params.pageSize;
    let currentPage = params.currentPage;

    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let  projectPro = await projectAchiDao.queryAllCase(startNum,size);
        let data = {
            projectCaseList: projectPro.data,
            total: projectPro.number
        }
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 用过id查询收藏项目的详细信息
let queryCaseById = async(req, res, next) => {
    let id = req.body.id;
    console.log(id);
    try {
        let  projectPro = await projectAchiDao.queryCaseById(id);
        if(projectPro.code === 200) {
            res.send({
                code: 200,
                data: projectPro.data,
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

// 筛选项目收藏
let queryCaseByFilter = async(req, res, next) => {
    let filter = req.body.filter;
    let pageSize = req.body.pageSize;
    let currentPage = req.body.currentPage;
    let startNum = (currentPage - 1) * pageSize;
    let size = pageSize * 1;
    try {
        let filterPro = await projectAchiDao.queryCaseByFilter(filter,startNum,size);
        if(filterPro.code === 200) {
            let data = {
                caseList: filterPro.data,
                total:  filterPro.total
            }
            res.send({
                code: 200,
                data: data,
                msg: 'success'
            });
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch(err) {
        console.log(err);
        res.send({
            code: 500,
            msg: err.message || err.msg
        })
    }
}


// 通过project_id 查询项目成果的成果id
let queryDelIdByProID = async (req, res, next) => {
    let project_id = req.body.project_id;
    try {
        let  projectAchiPro = await projectAchiDao.queryDelIdByProID(project_id);
        if(projectAchiPro.code === 200) {
            res.send({
                code: 200,
                data: projectAchiPro.data[0],
                msg: 'success'
            })
        } else {
            res.send({
                code: 201,
                msg: '数据库操作失败'
            })
        }
    }
    catch (err) {
        res.send({
          code: 500,
          msg: err.message || err.msg
        })
    }
}

let controller = {
    queryAchiByProId,
    inster,
    queryprojectAchiList,
    queryprojectAchiDetil,
    saveAchifile,
    getAchifileList,
    updateprojectAchi,
    deleteAllAchifile,
    deleteAchifile,
    queryByFilter,
    collectProjectCase,
    queryAllCase,
    queryCaseById,
    queryCaseByFilter,
    queryDelIdByProID
}
module.exports = controller