<template>
    <div id="infocenter">
        <!-- 头部标题栏 -->
        <HeadTop title="个人信息中心">
            <span slot="left">
                <div @click="routerback">
                    <Icon type="md-arrow-round-back" size="20" /><span>返回</span>
                </div>
            </span>
            <span slot="right"></span>
        </HeadTop>

        <!-- 内容 -->
        <div>
          <div class="upload">
            <!-- 个人信息 start -->
            <div style="width:280px;margin:0 auto;text-align:center;">
              <!-- 展示用户信息 start -->
              <div v-if="showInfo">
                <Form :model="info" label-position="right" :label-width="100">
                    <img :src="this.info.avatarurl" width="60" height="60"/>
                    <FormItem label="用户名:"  style="text-align:left;">
                        {{this.info.username}}
                    </FormItem>
                    <FormItem label="昵称:"  style="text-align:left;">
                        {{this.info.nickname}}
                    </FormItem>
                    <FormItem label="性别:"  style="text-align:left;">
                        {{this.info.sex}}
                    </FormItem>
                    <FormItem label="年龄:"  style="text-align:left;">
                        {{this.info.age}}
                    </FormItem>
                    <FormItem label="简介:"  style="text-align:left;">
                        {{this.info.disc}}
                    </FormItem>
                    <FormItem label="住址:"  style="text-align:left;">
                        {{this.info.address}}
                    </FormItem>
                </Form>
                <Button type="warning" @click="changeInfo" ghost>修改</Button>
              </div>
              <!-- 展示用户信息 end -->
              
              <!-- 修改用户信息表单 start -->
              <div v-if="showForm">
                <Form :model="info" label-position="left" :label-width="100">
                    <div>
                      <img @click.stop="uploadHeadImg" :src="this.info.avatarurl" width="60" height="60"/>
                      <input type="file" accept="image/*" @change="handleFile" id="hiddenInput" />
                    </div>
                    <FormItem label="用户名">
                        {{this.info.username}}
                    </FormItem>
                    <FormItem label="昵称">
                        <Input v-model="info.nickname" />
                    </FormItem>
                    <FormItem label="性别:"  style="text-align:left;">
                        <select  v-model="info.sex"  @change="changeProduct($event)" >
                            <option v-for="(sex,index) in sexList" :key="index"  :value="sex.value">{{sex.value}}</option>  
                        </select>  
                    </FormItem>
                    <FormItem label="年龄:"  style="text-align:left;">
                        <Input v-model="info.age" />
                    </FormItem>
                    <FormItem label="简介:">
                        <Input type="textarea" v-model="info.disc" :autosize="{minRows: 2,maxRows: 5}" />
                    </FormItem>
                    <FormItem label="住址:"  style="text-align:left;">
                        <Input v-model="info.address" />
                    </FormItem>
                </Form>
                <Button type="success" @click="sureInfo" ghost>确定</Button>
                <Button type="info" @click="cancelInfo" ghost>取消</Button>
              </div>
              <!-- 修改用户信息表单 end -->

              
            </div>
            <!-- 个人信息 end -->

          </div>
        </div>

    </div>
</template>

<script>
import store from '../../vuex/store'
import HeadTop from '../components/HeadTop/HeadTop'

export default {
    name:"Infocenter",
    data(){
        return {
            //用户框，修改框  展示与否
            showInfo:true,
            showForm:false,
            //用户信息(来接受路由传递过来的query),并且在界面上动态改变，如果用户确定则向后台提交
            info:{},
            //缓存用户信息，防止取消修改信息后原信息丢失
            oldinfo:{},
            //待上传的图片文件
            pic_file:{},
            //性别选项:男，女
            sexList:[
              {
                value:'男'
              },
              {
                value:'女'
              }
              
            ],
            
            //上传头像相关
            content: '',//分享动态的文字内容
            maxSize: 10240000 / 2,//图片的最大大小
            maxCount: 4,//最大数量
            filesArr: [],//保存要上传图片的数组
            images: []//转成base64后的图片的数组
        }
    },
    //引入vuex
    store,
    //引入子组件
    components: {
        HeadTop,
    },
    //方法
    methods:{  
        //获得修改用户信息时的性别
        changeProduct(event) {
            console.log('性别')
            console.log(event.target.value)
            // this.ProductActive = event.target.value; 
        },
        routerback(){//后退：返回上一个页面
            this.$router.back(-1);
        },
        changeInfo(){// 用户信息框消失，修改信息框展示
          this.showInfo = false;
          this.showForm = true;
        },
        sureInfo(){//确定修改用户信息，并提交给后台
          // 用户信息框展示，修改信息框消息
          this.showInfo = true;
          this.showForm = false;
          //添加接口所需的数据file--头像,username--用户名,disc--简介,_id--唯一标识
          //nickname--昵称,sex--性别,age--年龄,address--住址
          var formData=new FormData();// 创建form对象:接口所需的所有数据formData,即后台的req.body
          formData.append('file',this.pic_file);
          formData.append('username', this.info.username);
          formData.append('avatarurl', this.info.avatarurl);
          formData.append('disc', this.info.disc);
          formData.append('nickname', this.info.nickname);
          formData.append('sex', this.info.sex);
          formData.append('age', this.info.age);
          formData.append('address', this.info.address);
          formData.append('_id', this.info._id);
          console.log('打印formData')
          console.log(formData)
          this.$axios({
            url:'http://localhost:4444/uploadFile', 
            method:'post',
            data:formData, 
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
          .then((res) => {//res.data为后台返回的信息
            this.$Message.info(res.data.msg);
            this.info.avatarurl = res.data.avatarurl;
            // 更新备份数据，否则cancelInfo()时还是发送请求之前的数据作为备份数据
            this.oldinfo = Object.assign({}, this.info);            
          })
          .catch(err=>{
              this.$Message.info('修改个人信息失败！');
              //将缓存用户信息赋值给用户修改的原信息，防止导致视觉效果已经修改信息
              this.info = Object.assign({}, this.oldinfo);
              console.log('打印 提交修改的错误原因：');
              console.log(err);
          })

        },
        cancelInfo(){ //取消 修改用户信息
          // 用户信息框展示，修改信息框消息
          this.showInfo = true;
          this.showForm = false;
          //缓存用户信息，防止取消修改信息后原信息丢失
          this.info = Object.assign({}, this.oldinfo);
        },
        //头像上传
        // 打开图片上传
        uploadHeadImg: function () {
          this.$el.querySelector('#hiddenInput').click();
        },
        //点击图片触发  将头像显示(不涉及上传图片)
        handleFile: function (e) {
          let $target = e.target || e.srcElement;//找到input节点
          let file = $target.files[0];//找到上传的图片 只取第一张
          this.pic_file = $target.files[0];//存入data中
          // 单纯将头像显示
          var reader = new FileReader();//将文件内容读入内存,访问本地文件
          reader.onload = (data) => {//当读取操作成功完成时调用
            let res = data.target || data.srcElement;//捕获当前事件作用的对象
            this.info.avatarurl = res.result;//图片被转换成了二进制流(字符串类型),存储在info的avatarurl中
          };
          reader.readAsDataURL(file);//将图片内嵌在网页之中--Base64
        },
        


    },//methods-end
    /**
     * 生命周期函数开始
     */
    created(){
　　　　　//如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
        this.info.sex = this.sexList[0].value;
    },
    //beforeCreate 将路由中的 用户信息 赋值到 data(){} 中
    beforeCreate(){
        //防止token已经过期
        var localtoken = localStorage.getItem("token");
        var localusername = localStorage.getItem("user_name");
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
                  console.log('这里是vue[ 初始化 ]生命周期：');
                  if(res.data.status == 200){
                      this.info = res.data.info;
                      //对象赋值，分配一块新的内存空间
                      this.oldinfo = Object.assign({}, this.info);
                      console.log(res.data.info);
                  }
              })
              .catch(err=>{
                  console.log(err)
              })
    },//beforreCreate-end
}
</script>

<style  scoped>
#hiddenInput{
  display: none;
}

</style>
