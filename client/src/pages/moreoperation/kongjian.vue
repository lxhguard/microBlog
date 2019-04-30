<template>
    <div id="kongjian">
        <!-- 头部标题栏 -->
        <HeaderBG >
            <span slot="left">
                <div @click="routerback">
                    <Icon type="md-arrow-round-back" size="20" /><span>返回</span>
                </div>
            </span>
            <span slot="center">
                <div>
                    <img :src="this.info.avatarurl" width="80" height="80" style="border-radius:80px;"/>
                </div>
                <div>
                    <p>{{this.info.nickname}}</p>
                    <p>关注：{{this.info.cult}} | 粉丝：{{this.info.fan}}</p>
                    <p style="width:200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{this.info.disc}}</p>
                </div>
            </span>
            <span slot="right"></span>
        </HeaderBG>
        
        <!-- 容器 -->
        <div class="Pcontainer">
            <Tabs value="name1" class="allopts" >
                    <!-- 微博 -->
                    <TabPane label="微博" name="name1" class="opts">
                        <div style="padding: 10px;background: #f8f8f9；margin:0 auto;width:100%;">
                            <ul>
                                <li v-for="(posting,index) in postings" :key="index" class="feed">
                                    <!-- 头像框 -->
                                    <div class="avatar" >
                                        <a href="">
                                            <span class="skin_portrait_round"></span>
                                            <img :src="posting.info.avatarurl" alt="" height="100">
                                        </a>
                                    </div>
                                    <!-- 内容框 -->
                                    <div class="box bgr" >
                                        <!-- 左指箭头框 -->
                                        <div class="arr bor" ></div>
                                        <!-- 帖子文字内容 -->
                                        <div class="bd" >
                                            <a class="nick" href="#">{{posting.info.nickname}}</a>
                                            <pre class="content">{{posting.saycontent}}</pre>
                                        </div>
                                        <!-- 发表的图片 -->
                                        <div class="md" >
                                            <div class="img-attachments">
                                                <li v-for="(picurl,Picindex) in posting.picsurl" :key="Picindex" >
                                                    <img :src="picurl" alt="">
                                                    <br>
                                                </li>
                                            </div>
                                        </div>
                                        <!-- 说说底下的操作 -->
                                        <div class="ft" >
                                            <div class="info">
                                                <span class="c_tx">{{posting.addTime | formatDate}} {{posting.addTime | formatDateTwo}}</span>
                                                <span class="c_tx">OPPO R9</span>
                                            </div>
                                            <div class="op">
                                                <!-- 点赞 -->
                                                <span>
                                                    <a href="#" v-if="showLike" @click="DoLike">赞({{posting.likes}})</a>
                                                    <a href="#" v-if="!showLike" @click="DoLike">取消赞</a>
                                                </span>
                                                <!-- 评论 -->
                                                <a  @click="showCommentInput(index)">评论({{posting.cnumber}})</a>
                                                <!-- 转发 -->
                                                <a href="#">转发</a>

                                            </div>
                                        </div>
                                        <!-- 点赞与评论 -->
                                        <div class="box_extra bor" >
                                            <div class="box_extra_arr"></div>
                                            <div class="feed_like">
                                                <Icon type="md-thumbs-up" class="tubiao" size="20"/>
                                                <a href="javascript:void(0);" v-if="showZanMe">我和</a>
                                                、&nbsp;&nbsp;等
                                                <a href="javascript:void(0);" v-if="!showZanMe">{{posting.likes}}人</a>
                                                <a href="javascript:void(0);" v-if="showZanMe">{{posting.likes+1}}人</a>
                                                觉得很赞
                                            </div><br>
                                            <div class="mod_comment">
                                                <!-- 评论展示 -->
                                                <div class="mod_comments">
                                                    <ul>
                                                        <li v-for="(comment,commentindex) in posting.comments" :key="commentindex" class="comments_item">
                                                            <div class="avatar">
                                                                <a href="">
                                                                    <span class="skin_portrait_round"></span>
                                                                    <img :src="comment.avatarurl" alt="" height="100">
                                                                </a>
                                                            </div>
                                                            <div class="comments_content">
                                                                <div class="PC">
                                                                    <div style="width:100%;height:10px;"></div>
                                                                    <a href="javascript:void(0);">{{comment.nickname}} ：</a>
                                                                    <span>{{comment.saything}}</span>
                                                                </div>
                                                                <div class="comments_op">
                                                                    <span class="riqi">{{comment.date | formatDate}}</span>
                                                                    <a href="javascript:void(0);">回复</a>
                                                                </div>
                                                            </div>
                                                            <hr style=" height:1px;width:84%;margin:0px auto;margin-top:17px;border:none;border-top:1px dashed rgb(231, 231, 231);" />
                                                        </li>
                                                    </ul>
                                                </div>
                                                <br>
                                                <!-- 评论框 -->
                                                <div v-if="commentInput[`${index}`]">
                                                    <!-- 发表评论 -->
                                                    <div class="pinglunSay">
                                                        <textarea v-model="UserComment.saything"  class="textarea"></textarea>
                                                    </div>
                                                    <!-- 提交评论 按钮 -->
                                                    <div>
                                                        <div>
                                                            <Button @click="submitCS(posting._id)" type="info" class="fabiao">发表</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <br/>
                                </li>
                            </ul>
                        </div>
                    </TabPane>
                    <!-- 相册 -->
                    <TabPane label="相册" name="name2" class="opts">
                        <ul>
                            <li v-for="(posting,index) in postings" :key="index" class="feed">
                                <div class="md" >
                                    <div class="img-attachments">
                                        <li v-for="(picurl,Picindex) in posting.picsurl" :key="Picindex" >
                                            <div v-if="picurl">
                                                <img :src="picurl" alt="">
                                                <br>
                                            </div>
                                            <div  v-else> </div>
                                        </li>
                                    </div>
                                </div>
                                
                            <li/>
                        </ul>
                    </TabPane>
                    <!-- 聊天 -->
                    <TabPane label="聊天" name="name3" class="opts">
                        <div>
                            <p>聊天室:</p>
                            <p>{{this.$route.params.name}}</p>
                            <p>{{this.$route.params}}</p>
                        </div>
                    </TabPane>
                </Tabs>
        </div>
    </div>
</template>

<script>
import store from '../../../vuex/store'
import HeaderBG from '../../components/HeaderBG/HeaderBG'
import {formatDate} from '../../../static/common/date.js' //在组件中引用date.js

export default {
    name:"Kongjian",
    data(){
        return {
            //初始化接收后台的所有帖子
            postings:[],
            info:{},
            //模态对话框是否显示
            modal: false,
            //点赞 取消赞的显示切换
            showLike:true,
            //展示 我和点赞人数
            showZanMe:false,
            //时间
            timer: null,
            //显示 评论
            commentInput:[],
            //提交评论
            UserComment:{
                username:'',//评论的用户名
                saything:'',//评论的内容
                id:'',//被评论帖子的唯一标识
            }
        }
    },
    //引入vuex
    store,
    //引入子组件
    components: {
        HeaderBG,
    },
    watch: {
        //同一路由下，数据更新
        $route() {
            this.getData();
        }
    },
        //过滤器
    filters: {
       formatDate(time) {
            var date = new Date(time);
            return formatDate(date, 'yyyy.MM.dd');   //年月日 格式自己定义   'yyyy : MM : dd'  例 2018年12月5日的格式
       },
       formatDateTwo(time) {
            var date = new Date(time);
            return formatDate(date, 'hh:mm:ss');   //时间点 例 21点12分12秒的格式
        }
    },
    methods: {
        routerback(){//后退：返回上一个页面
            this.$router.back(-1);
        },
        DoLike(){//点赞或者取消赞
            this.showLike = !this.showLike;
            this.showZanMe = !this.showZanMe;
        },
        showCommentInput(index){
            if(this.commentInput[index] == false){
                for(var i = 0; i < this.commentInput.length; i++ ){
                    this.$set(this.commentInput,i,false);
                }
                this.$set(this.commentInput,index,true);
            }else{
                this.$set(this.commentInput,index,false);
            }
        },
        submitCS(id){//用户提交评论
            var localusername = localStorage.getItem("user_name");
            this.UserComment.username = localusername;
            this.UserComment.id = id;
            this.$axios({
                url:"http://localhost:4444/users/submitcommont",
                method:"post",
                data:this.UserComment
            })
            .then(res=>{
                //清空用户提交的评论
                this.UserComment.saything = '';
                this.$Message.info('评论成功');
                var localtoken = localStorage.getItem("token");
        var localusername = localStorage.getItem("user_name");
        var localparams = {
            token:localtoken,
            user_name:localusername
        };
          this.$axios({
                url:"http://localhost:4444/users/postings",
                method:"get",
                params:localparams 
              })
              .then(res=>{
                  console.log('这里(帖子)是vue[ 初始化 ]生命周期：');
                  console.log(res.data);
                  if(res.data.status == 200){
                      //得到用户发表的 所有帖子
                      this.postings = res.data.postings;
                      console.log(res.data.postings);
                  }else{
                      alert('登录已经过期！');
                      this.$router.push('/login');
                  }
              })
              .catch(err=>{
                  console.log(err)
              })
            })
            .catch(err=>{
                console.log(err)
            })
        },
        getData(){
            //防止token已经过期
            var localtoken = localStorage.getItem("token");
            var localusername = this.$route.params.name;
            var localparams = {
                token:localtoken,
                user_name:localusername
            };
          this.$axios({
                url:"http://localhost:4444/users/postings",
                method:"get",
                params:localparams 
              })
              .then(res=>{
                  console.log('这里(帖子)是vue[ 初始化 ]生命周期：');
                  console.log(res.data);
                  if(res.data.status == 200){
                      //得到用户发表的 所有帖子
                      this.postings = res.data.postings;
                      //赋值 评论框显示与否
                      for(var i = 0; i < this.postings.length; i++){
                          this.commentInput.push(false);
                      }
                  }else{
                      alert('登录已经过期！');
                      this.$router.push('/login');
                  }
              })
              .catch(err=>{
                  console.log(err)
              })
        },
        //得到用户信息
        getInfo(){
            //防止token已经过期
            var localtoken = localStorage.getItem("token");
            var localusername = this.$route.params.name;
            var localparams = {
                token:localtoken,
                user_name:localusername
            };
          this.$axios({
                url:"http://localhost:4444/users/islogin",
                method:"get",
                params:localparams 
              })
              .then(res=>{
                  console.log('这里(帖子)是vue[ 初始化 ]生命周期：');
                  console.log(res.data);
                  if(res.data.status == 200){
                      //得到用户信息
                      this.info = res.data.info;
                  }
              })
              .catch(err=>{
                  console.log(err)
              })
        }
    },
    beforeMount() {
        this.getData();
        this.getInfo();
    },

}
</script>

<style scoped>
#kongjian{
    background-color: #e9e9e9;
}
/* 帖子容器 */
.Pcontainer{
    padding:20px;
    width:65%;
    margin:0 auto;
    background-color: #fff;
    border-radius: 10px;
}
/* 帖子列表 */
ul,li{
    list-style: none;
}
/* 单个帖子 */
.feed{
    margin-bottom: -1px;
    position: relative;
    padding: 0 0 10px 70px;
    line-height: 1.5;
    min-height: 55px;
    word-wrap: break-word;
    display: list-item;

}
/* 头像框 */
.avatar{
    position: absolute;
    left: 0;
    top: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    border-radius: 4px;
}
.avatar a{
    width: 50px;
    height: 50px;
    display: block;
    overflow: hidden;
    border-radius: 4px;
    text-decoration: none;
    color: #295c9d;
    cursor: pointer;
}
.avatar .skin_portrait_round {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 50px;
    background-position: 0 -40px;
}
/* 内容框 */
.box {
    position: relative;
    border-radius: 5px;
}
.bgr{
    border-style: solid;
    border-width: 1px;
    border-color: #e7e7e7;
}
/* 左指箭头框 */
.arr{
    border-bottom-width:  7px !important;
    border-bottom-style: dashed !important;
    border-bottom-color: transparent !important;
    border-left-width: 7px !important;
    border-left-style: dashed !important;
    border-left-color: transparent !important;
    border-top-width: 7px !important;
    border-top-style: dashed !important;
    border-top-color: transparent !important;
    border-right-width: 7px;
    font-size: 0;
    width: 0;
    position: absolute;
    left: -14px;
    top: 15px;
}
/* 说说内容 */
.bd{
    font-size: 14px;
    padding: 9px 15px 0;
    line-height: 25px;
    margin-bottom: 8px;
    text-align:left;
}
.nick{
    margin-right: 8px;
    color: #295c9d;
    text-decoration: none;
    font-size: 14px;
    line-height: 25px;
    cursor: pointer;
}
.content{
    display: inline;
    white-space: pre-wrap;
    font-family: punctuation,'Microsoft Yahei';
    line-height: 25px;
    font-size: 14px;
}
.bor{
    border-style: solid;
    border-color: #e7e7e7;
}
/* 说说图片 */
.md{
    padding: 0 15px;
    margin: 0;
    display: block;
    line-height: 1.5;
    color: #000;
}
.img-attachments{
    font-size: 0;
    position: relative;
    margin-bottom: -8px;
    zoom: 1;
}
.img-attachments img{
    vertical-align: top;
    cursor: pointer;
    border: 0;
    width: 50%;
    margin-bottom:20px;
}
.ft{
    padding: 3px 15px 6px;
    height: 20px;
    margin-bottom:8px;
}
.info{
    float: left;
}
.op{
    float: right;
    position: relative;
}
.op a{
    margin-left: 10px;
    color: #295c9d;
}
.c_tx{
    color: #777;
    margin-right: 10px;
    display: inline-block;
    vertical-align: top;
}
.dropdown {
    display: inline-block;
    position: relative;
    z-index: 40;
}
.dropdown a{
    margin-left: 10px;
    position: relative;
    z-index: 30;
    outline: 0 none;
}
.dropdown-menu{
    position: absolute;
    top: -9px;
    right: -15px;
    border-width: 1px;
    z-index: 29;
    padding-top: 30px;
    border-style: solid;
    border-color: #e7e7e7;
    background: #fff;
    color: #000;
}
.dropdown-menu ul{
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
.dropdown-menu ul li{
    margin: 0 ;
    padding: 0;
    display: list-item;
}
.dropdown-menu ul li:hover{
    background-color: #e7e7e7;
}
.dropdown-menu ul li a{
    display: block;
    width: 50px;
    height: 32px;
    line-height: 32px;
    margin: 0!important;
}
.box_extra{
    padding: 15px;
    border-width: 1px 0 0;
    position: relative;
    border-style: solid;
    border-color: #e7e7e7;
}
.box_extra_arr{
    position: absolute;
    left: 30px;
    top: -8px;
    width:0;
    height:0;
	border-right:10px solid transparent;
	border-left:10px solid transparent;
	border-bottom:8px solid #e7e7e7;
}
.feed_like{
    padding: 3px 15px 6px;
    height: 20px;
    text-align: left;
}
.tubiao{
    color: royalblue;
}
.Pfooter{
    background-color: #e7e7e7;
    width:100%;
    text-align: center;
}
.comments_item{
    border: none;
    padding-top: 0;
    margin-top: 0;
    position:relative;
}
.ui_avatar{
    position: absolute;
    left: 0;
    top: 0;
}
.comments_content{
    position: relative;
    top: -4px;
    min-height: 35px;
    line-height: 1.6;  
    margin-bottom: -4px;
    text-align: left;
}
.PC{
    margin-left:60px;
    position: relative;
}
.comments_content a{
    margin-right: 8px;
    text-decoration: none;
    color: #295c9d;
    text-align: left;
    font-size:12px;
}
.comments_op{
    margin-left:60px;
    padding-top: 5px;
    line-height: 18px;
    position: relative;
    margin-bottom: 12px;
}
.riqi{
    margin-right: 10px;
    color: #777;
    line-height: 18px;
}
.textarea{
    width:60%;
    height: 80px;
    line-height: 20px;
    padding: 3px 8px 5px;
    background: none;
    font-size: 14px;
    box-shadow: inset 0 2px 4px 0 #E9E9E9;
    border: 1px solid #E8E8e8;
    outline:none;/*去除蓝色边框*/
    resize:none;/*禁止拉伸*/
}
.pinglunSay{
    position: relative;
}
.fabiao{
    position: relative;
    top:0;
    right:-26%;
}
</style>
