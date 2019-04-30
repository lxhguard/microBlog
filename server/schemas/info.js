var mongoose = require('mongoose');

//用户信息的表结构
module.exports = new mongoose.Schema({
  //用户名
  username: String,
  //昵称
  nickname: {
    type: String,
    default: '小萌新一枚'
  },
  //密码
  password: String,
  //邮箱
  email: String,
  //性别,
  sex:{
    type: String,
    default: '不告诉你'
  },
  //年龄
  age:{
    type:Number,
    default:18
  },
  //居住地址
  address:{
    type: String,
    default: '地球哦'
  },
  //头像路径
  avatarurl: {
    type: String,
    default: "http://localhost:4444/public/images/uploads/default.png"
  },
  //个人简介
  disc: {
    type: String,
    default: "此人很懒，还没写个人简介"
  },
  //关注
  cult: {
    type: Number,
    default: 0
  },
  //粉丝
  fan: {
    type: Number,
    default: 0
  }
});