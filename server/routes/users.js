var express = require('express');
var router = express.Router();
var express = require("express");
var Info = require("../models/Info");
var Say = require("../models/Say");
var OnlineChat = require("../models/OnlineChat");
//图片接收模块
var multer = require('multer');
//发送邮件模块
var nodemailer = require("nodemailer");
//引入数据库模块
var mysql = require("mysql");
// 引入jwt token工具
const JwtUtil = require('../public/utils/jwt');
//引入mongodb的_id转化工具
var mongoose = require('mongoose');


// 在线人数统计
var onlineCount = 0;
//在线用户名-列表
var onlinepeople = [];

//头像 接收,保存到服务端的配置---start
let filePath;
let fileName;

let Storage = multer.diskStorage({
  destination: function (req, file, cb) {//计算图片存放地址
    cb(null, './public/images/uploads');
  },
  filename: function (req, file, cb) {//图片文件名
    fileName = Date.now() + '_' + parseInt(Math.random() * 1000000) + '.png';
    filePath = '/public/images/uploads/' + fileName;
    cb(null, fileName)
  }
});
let upload = multer({ storage: Storage }).any();//file2表示图片上传文件的key
//头像 接收,保存到服务端的配置---end

//定义一个全局变量接收邮件验证码
var emailcode;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**多人聊天室  请求聊天记录*/
router.get('/onlinechat',function(req,res,next){
  var user_id = req.query.id;
  var user_name = req.query.user_name;
  var sendmessage = req.query.sendmessage;
  

  Info.find({
    username: user_name
  }).then(function (info) {//获取一个用户信息的数组,info[0]取出用户信息
    var message = new OnlineChat({
      saycontent: sendmessage,
      info: info[0]._id
    });
    message.save().then(function(newMessage){
      // console.log(newMessage);
      //res.send({ status: 200, msg: '发送成功' });
      OnlineChat.find().populate("info").sort({ addTime: -1 }).then(function(allMessage){
        // console.log(allMessage);
        res.send({ status: 200, msg: '发送成功', allMessage: allMessage, onlineCount: onlineCount });
      })
    })
  })
  
  
});

/**聊天室 有用户进入聊天室 */
router.get('/onlinechat/comein', function (req, res, next) {
  var user_name = req.query.user_name;
  console.log(user_name)
  //添加进 在线人数 列表-->onlinepeople (循环遍历保证没有重复添加)
  if (onlineCount == 0){
    onlinepeople.push(user_name);
    onlineCount++;
  }else{
    for (var i = 0; i < onlinepeople.length; i++) {
      console.log(onlinepeople.indexOf(user_name))
      if (onlinepeople.indexOf(user_name) == -1) {
        onlinepeople.push(user_name);
        onlineCount++;
      }
    }
  }
  
  console.log('有用户进入聊天室，打印人数')
  console.log(onlineCount)
  console.log(onlinepeople)
  res.send({ status: 200, msg: '欢迎进入在线聊天室', onlineCount: onlineCount });

})

/**聊天室 有用户离开聊天室 */
router.get('/onlinechat/lgout',function(req,res,next){
  var user_name = req.query.user_name;
  for (var i = 0; i < onlinepeople.length; i++) {
    if (onlinepeople[i] == user_name) {
      onlinepeople.splice(i, 1);
      onlineCount--;
    }
  }
  console.log('有用户离开聊天室，打印人数')
  console.log(onlineCount)
  console.log(onlinepeople)
  res.send({ status: 200, msg: '您离开了在线聊天室',  onlineCount: onlineCount });

})


router.post("/testpost",function(req,res,next){
  console.log(req.body);
  var data = req.body;
  console.log(data);
  res.send({msg:'post success!'})
});

/*登录
*/
router.get('/login', function (req, res, next) {
  //获得前端传来的数据
  var user = req.query;
  var userName = user.user_name;
  var userPass = user.user_password;

  //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
  Info.findOne({
    username: userName,
    password: userPass
  }).then(function(userInfo) {
    //userInfo是这条记录的所有信息
    // console.log(userInfo);
    if (!userInfo) {
      //用户信息不存在,即空记录
      console.log("[SELECT ERROR] -  这条（用户名密码）记录不存在");
      res.send({ status: 400, msg: "用户名或者密码错误" });
      return;
    }
    // 登陆成功，添加token验证
    let userId = userInfo._id;
    // 将用户id传入并生成token
    let jwt = new JwtUtil(userId);
    let token = jwt.generateToken();
    // 将 token 返回给客户端
    res.send({
      status: 200,
      msg: "登陆成功",
      token: token,
      user_name: userInfo.username
    });
  });


});

/** 发送邮件：验证码 */
router.post("/sendemail",function(req,res,next){
  let userRemail = req.body.remail;
  console.log(userRemail);
  //发件人的邮件授权
  var transporter = nodemailer.createTransport({
    //https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
    service: "qq",
    port: 465, // SMTP 端口
    secureConnection: true, // 使用 SSL
    auth: {
      user: "741183972@qq.com",
      //我的CardDev密码：dfaywetbufuibfic
      //这里密码不是qq密码，是你设置的smtp密码
      pass: "kxrjpmympgaebdbd"
    }
  });
   //验证码: 生成4位随机数
  var randomFns =(1000 + Math.round(Math.random() * 10000 - 1000));
  //验证码抛出块作用域，保存后在注册接口验证是否相等
  emailcode = randomFns;
  console.log('打印验证码');
  console.log(randomFns);
  //发件人 邮箱信息
  var mailOptions = {
    from: '741183972@qq.com', // 发件地址
    to: userRemail, // 收件列表
    subject: '验证码如下:', // 标题
    //text和html两者只支持一种,邮件信息只能是字符串
    // text: 'Hello world ?', // 标题
    html: randomFns.toString() // html 内容
  };
  // 发送邮件的结果
  transporter.sendMail(mailOptions, function (error, info) {
    
    if (error) {
      console.log("发送错误");
      return console.log(error);
    }
    console.log("Message sent: " + info.response);
    console.log('验证码邮件发送成功！');
    res.send({status:200,msg:'验证码已发送至您的邮箱，请查收。'})
  });
});

/* 注册 */
router.post("/register", function(req, res, next) {
  let register = req.body;
  console.log(register)
  console.log(emailcode);
  if(register.vcode == emailcode){
    Info.findOne({
      username: register.rname
    }).then(function (info) {
      //如果用户名存在，则返回信息告诉注册者已经存在
      console.log(info);
      if (info) {
        res.send({ status: 201, msg: '用户名已经存在，请重新命名' });
      } else {
        //如果用户名不存在，则保存到数据库
        var newUser = new Info({
          username: register.rname,
          password: register.rpassword,
          email: register.remail
        }).save().then(function (newUser) {
          console.log('保存新用户成功，新用户信息如下：');
          console.log(newUser);
          res.send({ status: 200, msg: '恭喜你注册用户成功' });
        });
      }
    });
  }else{
    res.send({ status: 201, msg: "你输入的验证码不对！" });
  }
});

/* 判断用户是否登录，显示对应的div.info */
router.get("/islogin", function(req, res, next) {
  console.log('进入/islogin');
  console.log(req.query);
  var user = req.query;
  var userName = user.user_name;

  //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
  Info.findOne({
    username: userName
  }).then(function(userInfo) {
    //userInfo是这条记录的所有信息
    console.log(userInfo);
    if (!userInfo) {
      //用户信息不存在,即空记录
      console.log("[SELECT ERROR] -  这条（用户名密码）记录不存在");
      res.send({ status: 400, msg: "用户名或者密码错误" });
      return;
    }
    //用户记录存在
    res.send({ status: 200, msg: "查询成功", info: userInfo })
  });


});

/**存储用户的 说说动态 */
router.post("/says", function(req,res,next){
  upload(req, res, function (err) {//upload-start
    console.log("进入/uploadFile-------------------------------------------");
    if (err) {
      console.log(err);
      res.send({ status: 400, msg: "很抱歉,发表说说失败!!!" });
    }
    //文本信息req.body:前端发送的数据即formData(username,disc,_id)
    var formData = req.body;
    // console.log('打印formData')
    // console.log(formData)

    // 图片路径filePath 赋初始值为空;req.files代表的图片数组
    var filePath = "";//单个图片路径
    var pictures = [];//所有图片路径数组
    req.files.forEach((item, index) => {
      //如果用户上传图片，则取用户上传的图片，存储，赋值
      filePath = `http://localhost:4444/public/images/uploads/${item.filename}`;
      pictures.push(filePath);//依次把图片放进数组中
    });//至此如果图片被上传了新的，那么filePath会有一个新的数值

    Info.find({
      username: formData.username
    }).then(function (info) {//获取一个用户信息的数组,info[0]取出用户信息
      //inf0[0]._id:得到关联表的用户id（在info.js中对应info）
      //获取 用户发表的说说
      var say = new Say({
        saycontent: formData.content,
        picsurl: pictures,
        info: info[0]._id
      });
      //保存 用户发表的说说
      say.save().then(function(newsay){//newsay:用户发表的信息，同say.js表结构
        // console.log('用户发表的说说成功存入blog数据库的says表,发表说说如下:');
        // console.log(newsay);
        res.send({ status: 200, msg: "恭喜你，发表说说成功!" });
      });
    });
    // var say = new Say({
    //   saycontent: formData.content,
    //   picsurl: pictures,
    //   info: info[0]._id
    // }).save().then(function (newSay) {
    //   return Say.find().sort({ addTime:-1});
      
    // }).then(function (List) {
      
    // });



  });//upload-end
});

/** 删除用户的动态 */
router.post("/deletesay",function(req,res,next){
  //得到前端post过来的数据(token,user_name,id:要删除的帖子的)
  var reqData = req.body;
  console.log('进入/deletesay')
  Say.remove({
    _id:reqData.id
  }).then(function () {
    console.log('数据库删除帖子成功！');
    res.send({ status: 200, msg: '删除帖子成功' });
  })
});

/** 接收用户对帖子的评论 */
router.post("/submitcommont",function(req,res,next){
  //得到前端post过来的数据(username,saything,id)
  var reqData = req.body;
  //通过评论者的用户名，获得评论者的信息
  Info.findOne({
    username: reqData.username
  }).then(function(info){
    //提交的评论
    var SubmitComment = {
      username: reqData.username,
      saything: reqData.saything,
      avatarurl: info.avatarurl,//评论者的头像
      nickname:info.nickname,//评论者的昵称
      date:new Date(),//评论发表的时间
      ucomments:[],//评论被回复的集合
    };
    //找到被评论的帖子
    Say.findOne({
      _id: reqData.id
    }).then(function (say) {
      say.comments.unshift(SubmitComment);
      say.cnumber++;//帖子的评论数量加一
      return say.save();//保存评论
    }).then(function(newComment){
      res.send({ status: 200, newComment: newComment})
    });
  })
  console.log("进入/submitcommont");
});

/* 获得用户的所有帖子 */
router.get("/postings", function (req, res, next) {
  console.log('进入/postings')
  let username = req.query.user_name;
  var userid;
  //通过前端传过来的用户名，查表获得用户id
  Info.find({
    username: username
  }).then(function (InfoInformation) {
    //得到用户id
    // console.log(InfoInformation);
    userid = InfoInformation[0]._id;
    //sort：最新发表的帖子在数组中的前面
    Say.find({
      info: userid
    }).populate("info").sort({addTime:-1}).then(function (allPostings) {
      // console.log(allPostings);
      // console.log('打印返回前端的数据')
      console.log({ status: 200, postings: allPostings })
      res.send({ status: 200, postings: allPostings })
    });
  });
});

/* 获得用户的 要编辑 帖子 */
router.get("/findbianji", function (req, res, next) {
  let say_id = req.query.say_id;
  // console.log(say_id)
  Say.find({
    _id:say_id
  }).then(function (saything){
    // console.log(saything)
    res.send({ status: 200, saything: saything })
  })
});

/* 编辑 帖子 */
router.post("/bianji", function (req, res, next) {
  upload(req, res, function (err) {//upload-start
    console.log("进入/uploadFile-------------------------------------------");
    if (err) {
      return res.end(err);
    }
    //文本信息req.body:前端发送的数据即formData(username,disc,_id)
    let formData = req.body;
    console.log('打印传来的数据')
    console.log(formData)

    // 头像路径filePath 赋初始值 为默认头像;req.files代表的图片数组,这里前端限制了头像只能选第一张，所以传递过来的数组只有一个。但是下面的代码也适用于多张图片。
    var filePath = formData.picsurl;
    req.files.forEach((item, index) => {
      //如果用户上传头像，则取用户上传的头像，存储，赋值
      filePath = `http://localhost:4444/public/images/uploads/${item.filename}`;
      console.log("数据库中的路径filePath------------");
      console.log(filePath);
    });//至此如果头像被上传了新的，那么filePath会有一个新的数值
    //至此，有用的数据:用户修改的信息formData(username,disc,_id),头像路径filePath
    // console.log(formData.saycontent)
    //开始更新数据库
    console.log(new Date())
    Say.updateOne({
      _id: mongoose.Types.ObjectId(formData._id)
    }, {
        saycontent: formData.saycontent,
        addTime: new Date(),
        picsurl: filePath
      }).then(function (newthing) {
        Say.find({
          _id: mongoose.Types.ObjectId(formData._id)
        }).then(function(newSay){
          console.log(newSay);
          // console.log('打印出newthing')
          // console.log(newthing);
          res.json({
            msg: "恭喜你,修改说说成功!"
          });
        })
        
      })
    //res.send({msg:200,status:200,saything:'sdfsd'})
  });//upload-end
});

/* 获得所有帖子 */
router.get("/allpostings", function (req, res, next) {
    //sort：最新发表的帖子在数组中的前面
    Say.find().populate("info").sort({ addTime: -1 }).then(function (allPostings) {
      // console.log(allPostings);
      // console.log('打印返回前端的数据')
      console.log({ status: 200, postings: allPostings })
      res.send({ status: 200, postings: allPostings })
    });
});

/* 勋章 */
router.get("/me/medal", function(req, res, next) {
  console.log('进入勋章');
  console.log(req.query);
  res.send({ status: 200, msg: "这是来自node/me/medal的信息，能看到说明进入勋章成功" });
});

module.exports = router;