
const crypto = require('crypto')
const id = {
    courseId: '01',
    reportId: '02',
    achiId: '03',
    selfId: '04',

}
var fs = require("fs");
var path = require("path");
var moment =   require("moment");
/**
 * 字符串转数组
 * @param {*字符串数组} stringarr 
 */
let strToArr = (stringarr) => {
    // "ttqw_withdraw_diff7.html,ttqw_withdraw_red.html,"
    // 去除" ,"变成字符串
    if(stringarr) {
        // 去除前后引号
        let string = stringarr.substr(1,stringarr.length-3);
        // console.log(string);
        let arr;
        arr = string.split(',');
        return arr;
    }
    return null;
}

let getDate = () => {
    let date = new Date()
    let year = date.getFullYear().toString()
    let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + ''
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + ''
    return year + month + day
}

let getHash = () => {
    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    let str = crypto.createHash('sha1').update(current_date + random).digest('hex');
    return str.substr(2, 7)
}

/**
 * 生成文件ID
 * @param {*所需ID类型} type 
 */
let getId = type => {
    return id[type] + getDate() + getHash();
}

/**
 * 将对象转换成sql语句
 * @param {*筛选条件} filter 
 */
let obj2MySql = filter => {
    if (typeof filter == 'string') {
      filter = JSON.parse(filter)
    }
    let str = null
    let first = true
    for (let key in filter) {
      if (filter[key] != null && filter[key] != undefined && filter[key] != '') {
        console.log(key, filter[key])
        if (first) {
          str = ''
        }
        else {
          str += ` and `
        }
        str += `${key} = '${filter[key].trim()}'`
        first = false
      }
  
    }
    return str
}

function getJsonLength(jsonData){
 
	var jsonLength = 0;
 
	for(var item in jsonData){
 
		jsonLength++;
 
	}
 
	return jsonLength;
 
}

/**
 * 获取数组中是否有这个字符串
 * @param {字符串} str 
 * @param {数组} arr 
 */
const hasOneOf = (str,arr) => {
  return arr.some(item => item.includes(str))
}


/**
 * 删除某一个包下面的需要符合格式的文件。
 * @param  {String} url  文件路径，绝对路径
 * @param  {String} name 需要删除的文件名称
 * @return {Null}   
 * @author huangh 20170123
 */
function deleteFile(url,name){
  var files = [];
  console.log(url,name);
  if(fs.existsSync(url)) {    //判断给定的路径是否存在    
      files = fs.readdirSync(url);    //返回文件和子目录的数组
      files.forEach(function(file,index){
          var curPath = path.join(url,file);
          if(fs.statSync(curPath).isDirectory()) { //同步读取文件夹文件，如果是文件夹，则函数回调
              deleteFile(curPath,name);
          } else {   
                 
              if(file.indexOf(name)>-1){    //是指定文件，则删除
                  fs.unlinkSync(curPath);
                  console.log("删除文件："+curPath);
              }
          }  
      });
  }else{
      console.log("给定的路径不存在！");
  }

}


/**
 *  比较两个时间yyyy-mm-dd字符串的大小
 * @param {*} curtime  当前的时间
 * @param {*} strtime  传入的比较对象
 */
function diffStrTime(curtime,strtime) {
    let curdate = moment(curtime).toDate();
    let strdate = moment(strtime).toDate();
    if(moment(curdate).diff(strdate) > 0) {
        return false;
    } else {
        return true;
    }
}

let utils = {
    strToArr,
    getId,
    obj2MySql,
    getJsonLength,
    hasOneOf,
    deleteFile,
    diffStrTime
}

module.exports = utils;