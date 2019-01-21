
const crypto = require('crypto')
const id = {
    courseId: '01',
    reportId: '02'
}
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

let utils = {
    strToArr,
    getId,
    obj2MySql,
    getJsonLength,
    hasOneOf
}

module.exports = utils;