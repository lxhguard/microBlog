<template>
    <div id="me">
        <!-- 头部标题栏 -->
        <HeadTop title="个人中心">
            <span slot="left">
            </span>
            <span slot="right">
                <Icon type="md-settings" size="20" />
            </span>
        </HeadTop>

        <div class="content">
            <!-- 用户信息 -->
            <div class="info">
                <!-- 默认是未登录状态 -->
                <div class="info_content" v-if="!showInfo">
                    <div class="info_img">
                        <Icon type="md-outlet" size="60" style="color:#c5c8ce;"/>
                    </div><br>
                    <div class="info_operation">
                        <router-link :to="{path:'/login',query:{}}">登录 | 注册</router-link>
                    </div><br>
                    <div class="info_fan">
                        <span>粉丝：0</span>&nbsp;&nbsp;
                        <span>关注：0</span>
                    </div>
                </div>
                <!-- 如果用户已经登录 -->
                <div class="info_content" v-if="showInfo">
                    <div class="info_img">
                        <!-- 头像 -->
                        <img :src="this.person.avatarurl" width="60" height="60"/>
                    </div><br>
                    <div class="info_operation">
                        <router-link :to="{path:'/infocenter',query:{person:this.person}}"><span class="info_color">用户名:{{person.user_name}}</span></router-link><br />
                        <router-link :to="{path:'/infocenter',query:{person:this.person}}"><span class="info_color">昵称:{{person.nickname}}</span></router-link>
                    </div>
                    <div class="info_disc">
                        简介：<span class="info_color">{{person.disc}}</span>
                    </div>
                    <div class="info_fan">
                        粉丝：<span class="info_color">{{person.fan}}</span>&nbsp;&nbsp;
                        关注：<span class="info_color">{{person.cult}}</span>
                    </div>
                </div>
            </div>

            <!-- 功能选项卡 -->
            <div >
                <Tabs value="name1" class="allopts">
                    <!-- 我的 -->
                    <TabPane label="我的" name="name1" class="opts">
                        <div style="padding: 10px;background: #f8f8f9；margin:0 auto;width:100%;">
                            <Card title="更多操作" icon="ios-options" :padding="0" shadow style="width: 100%;">
                                <CellGroup>
                                    <Cell >
                                        <div >
                                            <router-link to='/infocenter' style="color:#515A6E;">
                                                <Icon type="md-checkbox" class="iconColor" />&nbsp;&nbsp;
                                                <span>个人中心</span>
                                            </router-link>
                                        </div>
                                    </Cell>
                                    <Cell  >
                                        <div>
                                            <router-link to='/postings' style="color:#515A6E;">
                                                <Icon type="md-list-box" class="iconColor" />&nbsp;&nbsp;
                                                <span>我的帖子</span>
                                            </router-link>
                                        </div>
                                    </Cell>
                                    <Cell  >
                                        <div>
                                            <router-link to='/liaotian' style="color:#515A6E;">
                                                <Icon type="logo-twitch" class="iconColor" />&nbsp;&nbsp;
                                                <span>我的消息</span>
                                            </router-link>
                                        </div>
                                    </Cell>
                                    <Cell  >
                                        <div @click="getmedal">
                                            <Icon type="ios-paper" class="iconColor" />&nbsp;&nbsp;
                                            <span>我的任务</span>
                                        </div>
                                    </Cell>
                                    <Cell  >
                                        <div @click="getmedal">
                                            <Icon type="md-ionitron" class="iconColor" />&nbsp;&nbsp;
                                            <span>我的等级</span>
                                        </div>
                                    </Cell>
                                    <Cell class="testsss"  on-click="getmedal">
                                        <div @click="getmedal">
                                            <Icon type="md-ribbon" class="iconColor" />&nbsp;&nbsp;
                                            <span>我的勋章</span>
                                        </div>
                                    </Cell> 
                                    <Cell class="testsss"  on-click="getmedal">
                                        <div @click="logout">
                                            <Icon type="md-log-out" style="color:#ed4014;" />&nbsp;&nbsp;
                                            <span>退出登录</span>
                                        </div>
                                    </Cell>       
                                </CellGroup>
                            </Card>
                        </div>
                    </TabPane>
                    <!-- 美拍 -->
                    <TabPane label="美拍" name="name2" class="opts">
                        <div class="says">
                            <Form :model="sayIt" label-position="left" :label-width="100">
                            <FormItem label="说说内容:">
                                <Input type="textarea" v-model="sayIt.saycontent" :autosize="{minRows: 2,maxRows: 5}" placeholder="你想说点啥,come on!" />
                            </FormItem>
                        </Form>
                        <div class="picture">
                            <ul>
                                <li ref="files" class="uploader__file" v-for="(image,index) in images" :key="index">
                                    <Icon type="md-close-circle"  @click="deleteimg(index)" size="20" style="color:red;" />
                                    <img :src="image" alt="" width="350" height="350">
                                    <br><br>
                                </li>
                            </ul>
                            <!-- 清除图片浮动：否则会导致“发表说说”随着图片的增多而移动 -->
                            <div style="clear:both;"></div>
                            <!-- 两个br标签消除margin：5px；空间塌陷的影响 -->
                            <br/><br/>
                            <input @change="change" value="上传照片"  type="file" multiple accept="image/*">
                        </div>
                        <br/>
                        <Button type="success" @click="publish" ghost>发表说说</Button>
                        </div>
                    </TabPane>
                    <!-- 访客 -->
                    <TabPane label="访客" name="name3" class="opts">访客</TabPane>
                </Tabs>
            </div>

        </div>

        <TabBar></TabBar>
    </div>
</template>

<script>
import store from '../../vuex/store'
import TabBar from '../components/TabBar/TabBar'
import HeadTop from '../components/HeadTop/HeadTop'

export default {
    name:"Me",
    data(){
        return {
            showInfo:false,
            // 用户信息
            person:{
                nickname:'小萌新',
                user_name:'',
                fan:0,
                cult:0,
                disc:'',
                avatarurl:'',
            },
            //说说
            sayIt:{
                saycontent:'',
                avatarurl:[],
            },
            //上传说说图片相关
            maxSize: 10240000 / 2,//图片的最大大小
            maxCount: 9,//最大数量
            filesArr: [],//保存要上传图片的数组
            images: []//转成base64后的图片的数组
            
        }
    },
    methods:{
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
            
        },
        //发表说说
        publish(){
            var formData=new FormData();// 创建form对象:接口所需的所有数据formData,即后台的req.body
            formData.append('content',this.sayIt.saycontent);
            formData.append('username',this.person.user_name);
            //循环遍历图片数组，把图片挨个加入formData
            this.filesArr.forEach((file) => {
                formData.append('pictures', file);
            });
            this.$axios({
                  url:"http://localhost:4444/users/says",
                  method:"post",
                  data:formData, 
                    headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
                .then(res=>{
                    console.log('打印后台返回的信息');
                    console.log(res.data);
                    //发表说说成功
                    if(res.data.status == 200){
                        //清空说说input框
                        this.sayIt = {
                            saycontent:'',
                            avatarurl:[],
                        };
                        //清空图片区域
                        this.images = [];
                        this.filesArr = [];
                        //弹出后台返回信息,并且跳转到页面
                        this.$Message.info(res.data.msg);
                        this.$router.push('/me');
                    }else{
                      this.$Message.info(res.data.msg);
                      this.$router.push('/me');
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        },
        // 上传头像相关的所有方法--开始
        //删除图片
        deleteimg(index) {
            this.filesArr.splice(index, 1);
            this.images.splice(index, 1);
        },
        //改变图片
        change(e) {
            let files = e.target.files;
            // 如果没有选中文件，直接返回
            if (files.length === 0) {
                return;
            }
            if (this.images.length + files.length > this.maxCount) {
                this.$Message.info('最多只能上传' + this.maxCount + '张图片！');
                return;
            }
            let reader;
            let file;
            let images = this.images;
            for (let i = 0; i < files.length; i++) {
                file = files[i];
                this.filesArr.push(file);//依次把图片放进数组中
                //H5:FileReader主要用于将文件内容读入内存，通过一系列异步接口，可以在主线程中访问本地文件。
                reader = new FileReader();
                if (file.size > self.maxSize) {
                    this.$Message.info('图片太大，不允许上传！');
                    continue;
            }
            //onload	当读取操作成功完成时调用
            reader.onload = (e) => {
                let img = new Image();
                img.onload = function () {
                    let canvas = document.createElement('canvas');
                    //getContext() 方法返回一个用于在画布上绘图的环境。
                    //当前唯一的合法值是 "2d"，它指定了二维绘图，并且导致这个方法返回一个环境对象，该对象导出一个二维绘图 API。
                    let ctx = canvas.getContext('2d');
                    let w = img.width;
                    let h = img.height;
                    // 设置 canvas 的宽度和高度
                    canvas.width = w;
                    canvas.height = h;
                    ctx.drawImage(img, 0, 0, w, h);
                    //canvas.toDataURL(type, encoderOptions);
                    //图片格式，默认为image/png。图片质量，取值范围为0到1。返回值：包含dataURI的DOMString。
                    //在转换成dataURI前必须先确保图片成功加载到，于是.toDataURL()方法应该写在<img>的onload异步事件中。
                    let base64 = canvas.toDataURL('image/png');
                    images.push(base64);
                };
                //e.target指的是触发事件的节点
                img.src = e.target.result;
            };
            //FileReader对象的readAsDataURL方法可以将读取到的文件编码成Data URL
            reader.readAsDataURL(file);
            }
        },// 上传头像相关的所有方法--结束
        

        // 获得勋章方法
        getmedal(value){
            console.log(value);
            this.$axios({
                  url:"http://localhost:4444/users/me/medal",
                  method:"get",
                  params:{"name":"功勋"}
                })
                .then(res=>{
                    console.log('me.vue勋章墙返回信息');
                    console.log(res.data);
                    //成功取得勋章信息
                    if(res.data.status == 200){
                        this.$Message.info(res.data.msg);
                    }else{
                      this.$Message.info(res.data.msg);
                      this.$router.push('/login');
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
        }
    },//methods结束
    //引入vuex
    store,
    //引入子组件
    components: {
        HeadTop,
        TabBar,
    },
    //vue生命周期钩子函数
    beforeCreate(){
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
                        this.person.user_name = res.data.info.username;
                        this.person.nickname = res.data.info.nickname;
                        this.person.disc = res.data.info.disc;
                        this.person.fan = res.data.info.fan;
                        this.person.cult = res.data.info.cult;
                        this.person.avatarurl = res.data.info.avatarurl;
                        console.log(res.data.info);
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
    },
}
</script>

<style scoped>
.content{
    width:100%;
    margin: 0 auto;
}
/* 用户信息，设置背景图片 */
.info{
    height: 200px;
    width: 100%;
    background-image: url('../images/starssky.jpeg');
}
.info_content{
    width:400px;
    height:200px;
    padding:30px;
    margin: 0 auto;
}
.info_operation a{
    color:white;
}
.info_fan{
    color:white;
}
.info_disc{
    color:white;
}
.info_color{
    color:white;
}
/* 选项卡 */
.allopts{
    width: 100%;
    margin: 0 auto;
}

/* 图标颜色 */
.iconColor{
    color:#5cadff;
}
/* 美拍 */
.says{
    width:80%;
    margin:0 auto;
}
ul,li{
    list-style: none;
    float:left;
}
/* 上传图片显示大小 */
.uploader__file{
    margin:5px;
    width:350px;
    height:350px;
}
</style>
