var express = require('express');
var router = express.Router();
var path = require("path");
var Info = require("../models/Info");
//图片接收模块
var multer = require('multer');


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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*  
  用于接收前端的用户信息修改:头像+文字
*/
router.post("/uploadFile", function(req, res, next) {
  upload(req, res, function (err) {//upload-start
    console.log("进入/uploadFile-------------------------------------------");
    if (err) {
      return res.end(err);
    }
    //文本信息req.body:前端发送的数据即formData(username,disc,_id)
    let formData = req.body;

    // 头像路径filePath 赋初始值 为默认头像;req.files代表的图片数组,这里前端限制了头像只能选第一张，所以传递过来的数组只有一个。但是下面的代码也适用于多张图片。
    var filePath = formData.avatarurl;
    req.files.forEach((item, index) => {
      //如果用户上传头像，则取用户上传的头像，存储，赋值
      filePath = `http://localhost:4444/public/images/uploads/${item.filename}`;
      console.log("数据库中的路径filePath------------");
      console.log(filePath);
    });//至此如果头像被上传了新的，那么filePath会有一个新的数值
    //至此，有用的数据:用户修改的信息formData(username,disc,_id),头像路径filePath
    console.log(formData)
    //开始更新数据库
    Info.update({
      username:formData.username
    },{
        disc: formData.disc,
        nickname: formData.nickname,
        age: formData.age,
        sex: formData.sex,
        address: formData.address,
        avatarurl: filePath
    }).then(function(){
      res.json({
        avatarurl: filePath,
        msg: "恭喜你,修改个人信息成功!"
      });
    })

    
  });//upload-end
});





module.exports = router;
