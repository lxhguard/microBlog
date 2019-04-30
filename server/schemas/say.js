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
        default: "该用户没写内容"
    },
    //发表图片
    picsurl: {
        type: Array,
        default: []
    },
    //添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    //阅读量
    views: {
        type: Number,
        default: 0
    },
    //点赞量
    likes: {
        type: Number,
        default: 0
    },
    //评论量
    cnumber: {
        type: Number,
        default: 0
    },
    //评论
    comments: {
        type: Array,
        default: []
    }
});
