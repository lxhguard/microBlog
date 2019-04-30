var mongoose = require('mongoose');

//说说的表结构
module.exports = new mongoose.Schema({
    //关联字段 - 用户id
    info: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: "Info"
    },
    //文字内容
    saycontent: {
        type: String,
        default: ""
    },
    //添加时间
    time: {
        type: Date,
        default: new Date()
    },
});
