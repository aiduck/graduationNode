
const crypto = require('crypto')
const id = {
    report_file: '01',
}
/**
 * 字符串转数组
 * @param {*字符串数组} stringarr 
 */
let strToArr = (stringarr) => {
    // "ttqw_withdraw_diff7.html,ttqw_withdraw_red.html,"
    // 去除" ,"变成字符串
    if(stringarr) {
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
    return id[type] + getDate() + getHash()
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
let utils = {
    strToArr,
    getId,
    obj2MySql
}

module.exports = utils;