<template>
    <div>
        <!-- 头部标题栏 -->
        <HeadTop title="多人在线- -实时聊天室">
            <span slot="left">
            </span>
            <span slot="right">
                <Icon type="md-clipboard" size="20" />
            </span>
        </HeadTop>

        <!-- 聊天室 -->
        <div class="chat-wrap">
            <div class="chat-box">
                <!--聊天框头部-->
                <div class="chat-header">
                    <div class="button-box">
                        <input type="button" @click="logout" class="log-out" value="退出登录">
                    </div>
                </div>
                <!--聊天框主体-->
                <div class="chat-body">
                    <!--聊天框左侧-->
                    <div class="chat-body-left">
                        <!--聊天框左侧聊天内容-->
                        <div class="chat-content">
                            <ul>
                                <li v-for="(oneMessage,index) in  allcomments" :key="index">
                                        <div class="my-message-box" v-if="oneMessage.info.username == Localusername">
                                            <div class="message-content">
                                                {{oneMessage.saycontent}}
                                            </div>
                                            <div class="message-arrow"></div>
                                            <div class="user-information">
                                                <img class="user-chat-img" :src="oneMessage.info.avatarurl"/>
                                                <div class="user-chat-name'">{{oneMessage.info.nickname}}</div>
                                            </div>
                                        </div>
                                        
                                        <div class="other-message-box" v-else>
                                            <div class="user-information">
                                                <img class="user-chat-img" :src="oneMessage.info.avatarurl"/>
                                                <div class="user-chat-name'">{{oneMessage.info.nickname}}</div>
                                            </div>
                                            <div class="other-message-arrow"></div>
                                            <div class="other-user-information">
                                                {{oneMessage.saycontent}}
                                            </div>
                                        </div>
                                        
                                    
                                </li>
                            </ul>
                        </div>
                        <!--聊天框左侧聊天输入框-->
                        <div class="chat-edit">
                            <input v-model="sendmessage" type="text" class="edit-box" placeholder="请输入要发送的信息" > 
                            <input @click="sendIt" type="button" class="edit-button" value="发送">
                        </div>
                    </div>
                    <!--聊天框右侧-->
                    <div class="chat-body-right">
                        <!--聊天框右侧统计人数-->
                        <div class="online-count">Online:{{this.onlineCount}}</div>
                        <!--聊天框右侧用户名-->
                        <div class="user-name">{{this.person.nickname}}</div>
                        <!--聊天框右侧头像-->
                        <img class="user-img" :src="this.person.avatarurl" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 下方导航栏 -->
        <TabBar></TabBar>
    </div>
</template>

<script>
import store from '../../vuex/store'
import TabBar from '../components/TabBar/TabBar'
import HeadTop from '../components/HeadTop/HeadTop'


export default {
    name:"Discuss",
    data(){
        return {
            // 用户信息
            person:{
                nickname:'游客',
                user_name:'',
                fan:0,
                cult:0,
                disc:'',
                avatarurl:"http://localhost:4444/public/images/uploads/default.png",
                id:''
            },
            //本地存储的用户名
            Localusername:"",
            //要发送的信息
            sendmessage:"",
            //聊天记录->来自后台
            allcomments:[],
            //在线人数
            onlineCount:0,
        }
    },
    //引入vuex
    store,
    //引入子组件
    components: {
        TabBar,
        HeadTop
    },
    methods: {
        // 退出登录
        logout(){
            //判断用户是否登录，显示对应的div.info
            var localtoken = localStorage.getItem("token");
            var localusername = localStorage.getItem("user_name");
            var localparams = {
                token:localtoken,
                user_name:localusername
            }
            this.$axios({
                  url:"http://localhost:4444/users/islogin",
                  method:"get",
                  params:localparams 
                })
                .then(res=>{
                    console.log('这里是vue初始化生命周期：');
                    if(res.data.status == 200){
                        this.showInfo = true;
                        localStorage.setItem('token', null);
                        localStorage.setItem('user_name', null);
                        localStorage.setItem('info', null);
                        this.$Message.info('退出登录成功');
                        this.$router.push('/login');
                    }else{
                        this.$Message.info('您尚未登录，请先登录！')
                        this.$router.push('/login');
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        },//退出登录-end
        //发送 聊天信息
        sendIt(){
            //判断用户是否登录，显示对应的div.info
            var localtoken = localStorage.getItem("token");
            var localusername = localStorage.getItem("user_name");
            //如果是游客，强制登录
            console.log(localusername)
            if(localusername == 'null' || localusername == "" || !localusername)
            {
                this.$Message.info('您尚未登录，请先登录！')
                this.$router.push('/world');
            }
            var localparams = {
                token:localtoken,
                user_name:localusername,
                sendmessage:this.sendmessage,
                id:this.person.id
            };
            this.$axios({
                        url:"http://localhost:4444/users/onlinechat",
                        method:"get",
                        params:localparams 
                    })
                    .then(res=>{
                        console.log('这里是vue初始化生命周期：');
                        if(res.data.status == 200){
                            this.sendmessage = "";
                            this.allcomments = res.data.allMessage;
                            this.onlineCount = res.data.onlineCount;
                            this.$Message.info(res.data.msg);
                            console.log(res.data.info);
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            }
    },//methods-end
    //vue生命周期钩子函数
    //初始化所需要的数据
    beforeCreate(){
        //判断用户是否登录，显示对应的div.info
        var localtoken = localStorage.getItem("token");
        var localusername = localStorage.getItem("user_name");
        var localparams = {
            token:localtoken,
            user_name:localusername,
        }
        // 获得用户信息，展示在右侧
        this.$axios({
                  url:"http://localhost:4444/users/islogin",
                  method:"get",
                  params:localparams 
                })
                .then(res=>{
                    console.log('这里是初始化用户信息，显示在右侧');
                    if(res.data.status == 200){
                        this.showInfo = true;
                        this.person.user_name = res.data.info.username;
                        this.person.nickname = res.data.info.nickname;
                        this.person.disc = res.data.info.disc;
                        this.person.fan = res.data.info.fan;
                        this.person.cult = res.data.info.cult;
                        this.person.avatarurl = res.data.info.avatarurl;
                        this.person.id = res.data.info._id;
                        console.log(res.data.info);
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        // 初始化 在线用户列表和人数，并且获得后台数据
        this.$axios({
                    url:"http://localhost:4444/users/onlinechat/comein",
                    method:"get",
                    params:localparams 
                })
                .then(res=>{
                    console.log('这里是 获得在线用户人数');
                    if(res.data.status == 200){
                        this.onlineCount = res.data.onlineCount;
                        this.$Message.info(res.data.msg);
                        console.log(res.data.onlineCount);
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
    },//beforeCreated--end
    //判断气泡位置
    mounted() {
        //元素加载完毕后得到 当前用户名，判断->聊天气泡在左在右
        this.Localusername = localStorage.getItem("user_name");
    },
    //离开聊天室->减少在线人数
    destroyed() {
            //判断用户是否登录，显示对应的div.info
            var localtoken = localStorage.getItem("token");
            var localusername = localStorage.getItem("user_name");
            var localparams = {
                token:localtoken,
                user_name:localusername
            }
            this.$axios({
                        url:"http://localhost:4444/users/onlinechat/lgout",
                        method:"get",
                        params:localparams 
                    })
                    .then(res=>{
                        console.log('这里是vue初始化生命周期：');
                        if(res.data.status == 200){
                            this.onlineCount = res.data.onlineCount;
                            this.$Message.info(res.data.msg);
                            console.log(res.data.info);
                        }
                    })
                    .catch(err=>{
                        console.log(err)
                    })
    },//destroyed--end
}
</script>

<style scoped>

/* 聊天室的css样式 */
* {
    margin: 0;
    padding: 0;
    font-family: "Mircrosoft Yahei";
    /*border: 1px solid black;*/
}
 
.chat-wrap {
    width: 100%;
    height: 100%;
}
 
 
/*背景色*/
 
.chat-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(-135deg, #51D15B, #42A855);
    background: -moz-linear-gradient(-135deg, #51D15B, #42A855);
    background: -webkit-linear-gradient(-135deg, #51D15B, #42A855);
    background: -o-linear-gradient(-135deg, #51D15B, #42A855);

}
 
 
/*最外层*/
 
.chat-box {
    width: 50%;
    max-width: 720px;
    min-width: 400px;
    height: 80%;
    min-height: 530px;
    max-height: 530px;
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 1px 1px 15px #333333;
    margin-top:6%;
    margin-bottom:6%;
}
 
 
/*头部*/
 
.chat-header {
    margin: 5px;
    box-shadow: 1px 1px 15px #7B8C99;
}
 
.button-box {
    display: flex;
    justify-content: flex-end;
}
 
.log-out {
    height: 100%;
    font-size: 14px;
    font-weight: bold;
    padding: 5px 15px;
    color: #79C2EA;
    background: #fff;
    outline: none;
    border: none;
    border-radius: 15px;
    cursor: pointer;
}
 
 
/*主体*/
 
.chat-body {
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 5px;
    padding: 5px;
}
 
 
/*主体左侧*/
 
.chat-body-left {
    height: 100%;
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 5px;
}
 
 
/*左侧内容*/
 
.chat-content {
    margin-bottom: 5px;
    min-height: 400px;
    height: 400px;
    box-shadow: 1px 1px 15px #7B8C99;
    overflow: auto;
}
 
 
/*聊天气泡*/
 
.my-message-box {
    display: flex;
    justify-content: flex-end;
    align-content: center;
    margin: 5px;
}
 
.other-message-box {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    margin: 5px;
}
 
.message-content {
    display: flex;
    justify-content: center;
    align-content: center;
    background-color: #51D15B;
    padding: 5px 10px;
    border-radius: 15px;
    color: #fff;
}
 
.other-message-content {
    display: flex;
    justify-content: center;
    align-content: center;
    background-color: #79C2EA;
    padding: 5px 10px;
    border-radius: 15px;
    color: #fff;
}
 
.message-content span {
    padding: 20px 0px;
}
 
.other-message-content span {
    padding: 20px 0px;
}
 
.message-arrow {
    width: 0px;
    height: 0px;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent transparent #51D15B;
    align-self: center;
}
 
.other-message-arrow {
    width: 0px;
    height: 0px;
    border-width: 8px;
    border-style: solid;
    border-color: transparent #79C2EA transparent transparent;
    align-self: center;
}
 
.user-information {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
}
 
.other-user-information {
    display: flex;
    flex-direction: column;
    align-content: flex-end;
    background-color: #79C2EA;
}
 
.user-chat-img {
    width: 50px;
    height: 50px;
}
 
.user-chat-name {
    color: #333333;
    font-size: 16px;
    text-align: center;
}
 
/*聊天输入框*/
.chat-edit {
    margin-top: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 1px 1px 15px #7B8C99;
    overflow: hidden;
}
/*聊天输入框输入区域*/
.edit-box {
    width: 80%;
    height: 100%;
    margin: 5px;
    border: none;
    outline: none;
}
 
/*聊天框输入按钮*/
.edit-button {
    height: 100%;
    padding: 5px 15px;
    background: #fff;
    color: #79C2EA;
    outline: none;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
}
 
 
/*主体右侧*/
 
.chat-body-right {
    height: 100%;
    min-height: 450px;
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 5px;
    box-shadow: 1px 1px 15px #7B8C99;
}
 
 
/*右侧内容*/
 
.user-name {
    margin: 15px;
    font-size: 18px;
    font-weight: bold;
    color: #79C2EA;
}
 
.user-img {
    width: 100px;
    height: 100px;
    margin: 5px;
}
 
.online-count {
    font-size: 18px;
    font-weight: bold;
    color: #79C2EA;
}
 
/*兼容小屏幕*/
@media screen and (max-width: 420px) {
    .chat-box {
        width: 50%;
        max-width: 720px;
        min-width: 300px;
        height: 80%;
        min-height: 530px;
        max-height: 530px;
    }
    .chat-body-left {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin: 5px;
    }
    .chat-body-right {
        display: none;
    }
}
</style>
