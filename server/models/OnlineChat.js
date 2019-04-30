var mongoose = require('mongoose');
var OnlineChatSchemas = require('../schemas/onlinechat');

var Chat = mongoose.model('OnlineChat', OnlineChatSchemas);

// 在指定的秒数后删除该文档--
Chat.createIndexes(OnlineChatSchemas.index({ time: 1 }, { expires: 60*60*2 }), function (err, info) {
    if (err) console.error(err);
    console.log('成功 定时清空OnlineChat表格 !')
    //console.info(info);
});
/**
 * 索引字段：time
 * 过期时间：expires 60.60.2秒 = 2小时
 * 
 */


module.exports = Chat;