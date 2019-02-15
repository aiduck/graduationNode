// 基础属性
const TOKEN_MAX_TIME =  30 * 60 * 60 //token的最大时间

// const uploadPath =  {
//   fileDemo: './public/uploads/fileDemo',
// }

// module.exports = {
//   TOKEN_MAX_TIME,
//   uploadPath
// }


const config = {
  uploadPath: {
    fileDemo: './public/uploads/fileDemo',
    userImgDemo: './public/uploads/userImgDemo'
  },
  TOKEN_MAX_TIME
}

module.exports = config