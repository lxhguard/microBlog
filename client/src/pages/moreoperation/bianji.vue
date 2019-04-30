<template>
    <div>
        <!-- 头部标题栏 -->
        <HeadTop title="编辑帖子">
            <span slot="left">
                <div @click="routerback">
                    <Icon type="md-arrow-round-back" size="20" /><span>返回</span>
                </div>
            </span>
            <span slot="right"></span>
        </HeadTop>

        <!-- 编辑的帖子 -->
        <div>
            {{this.saything}}
          <div class="upload">
            <!-- 个人信息 start -->
            <div style="width:80%;margin:0 auto;text-align:center;">
              <!-- 展示用户信息 start -->
              <div v-if="showInfo">
                <Form :model="saything" label-position="right" >
                    <FormItem label="说说内容:"  style="text-align:left;">
                        {{this.saything.saycontent}}
                    </FormItem>
                    <ul>
                        <li v-for="(onePicsurl,index) in this.saything.picsurl" :key="index">
                            <img :src="onePicsurl" width="200" height="200"/>
                        </li>
                    </ul>
                </Form>
                <Button type="warning" @click="changesaything" ghost>修改</Button>
              </div>
              <!-- 展示用户信息 end -->
              
              <!-- 修改用户信息表单 start -->
              <div v-if="showForm">
                <Form :model="saything" label-position="left">
                    <FormItem label="说说内容:"  style="text-align:left;">
                        <Input type="textarea" v-model="saything.saycontent" :autosize="{minRows: 2,maxRows: 15}" />
                    </FormItem>
                    <div>
                        <ul>
                            <li v-for="(onePicsurl,picindex) in this.saything.picsurl" :key="picindex">
                                {{onePicsurl}}
                                <img :src="onePicsurl" @click.stop="uploadHeadImg" width="200" height="200"/>
                            </li>
                        </ul>
                      <input type="file" accept="image/*" @change="handleFile" id="hiddenInput" />
                    </div>
                </Form>
                <Button type="success" @click="sureSay" ghost>确定</Button>
                <Button type="info" @click="cancelSay" ghost>取消</Button>
              </div>
              <!-- 修改用户信息表单 end -->

              
            </div>
            <!-- 个人信息 end -->

          </div>
        </div>
    </div>
</template>

<script>
import store from '../../../vuex/store'
import HeadTop from '../../components/HeadTop/HeadTop'
import {formatDate} from '../../../static/common/date.js' //在组件中引用date.js

export default {
    name:"BianJi",
        //引入vuex
    store,
    //引入子组件
    components: {
        HeadTop,
    },
    data(){
        return {
            saything:{},
            //用户框，修改框  展示与否
            showInfo:true,
            showForm:false,
            //用户信息(来接受路由传递过来的query),并且在界面上动态改变，如果用户确定则向后台提交
            saything:{},
            //缓存用户信息，防止取消修改信息后原信息丢失
            oldsaything:{},
            //待上传的图片文件
            pic_file:{},
            //上传头像相关
            content: '',//分享动态的文字内容
            maxSize: 10240000 / 2,//图片的最大大小
            maxCount: 4,//最大数量
            filesArr: [],//保存要上传图片的数组
            images: []//转成base64后的图片的数组
        }
    },
    methods: {
        routerback(){//后退：返回上一个页面
            this.$router.back(-1);
        },
        changesaything(){// 用户信息框消失，修改信息框展示
          this.showInfo = false;
          this.showForm = true;
        },
        sureSay(){//确定修改用户信息，并提交给后台
          // 用户信息框展示，修改信息框消息
          this.showInfo = true;
          this.showForm = false;
          //添加接口所需的数据file--头像,username--用户名,disc--简介,_id--唯一标识
          //nickname--昵称,sex--性别,age--年龄,address--住址
          var formData=new FormData();// 创建form对象:接口所需的所有数据formData,即后台的req.body
          formData.append('file',this.pic_file);
          formData.append('saycontent', this.saything.saycontent);
          formData.append('_id', this.saything._id);
          console.log('打印formData')
          console.log(formData)
          this.$axios({
            url:'http://localhost:4444/users/bianji', 
            method:'post',
            data:formData, 
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          })
          .then((res) => {//res.data为后台返回的信息
            this.$Message.info(res.data.msg);
            // 更新备份数据，否则cancelsaything()时还是发送请求之前的数据作为备份数据
            this.oldsaything = Object.assign({}, this.saything);            
          })
          .catch(err=>{
              this.$Message.info('修改个人信息失败！');
              //将缓存用户信息赋值给用户修改的原信息，防止导致视觉效果已经修改信息
              this.saything = Object.assign({}, this.oldsaything);
              console.log('打印 提交修改的错误原因：');
              console.log(err);
          })

        },
        cancelSay(){ //取消 修改用户信息
          // 用户信息框展示，修改信息框消息
          this.showInfo = true;
          this.showForm = false;
          //缓存用户信息，防止取消修改信息后原信息丢失
          this.saything = Object.assign({}, this.oldsaything);
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
            this.saything.picsurl = res.result;//图片被转换成了二进制流(字符串类型),存储在info的picsurl中
          };
          reader.readAsDataURL(file);//将图片内嵌在网页之中--Base64
        },
    
        // 得到要编辑的说说
        getData(){
            //防止token已经过期
            var localtoken = localStorage.getItem("token");
            var id = this.$route.params.id;
            var localparams = {
                token:localtoken,
                say_id:id
            };
          this.$axios({
                url:"http://localhost:4444/users/findbianji",
                method:"get",
                params:localparams 
              })
              .then(res=>{
                  console.log('这里(帖子)是vue[ 初始化 ]生命周期：');
                  console.log(res.data);
                  if(res.data.status == 200){
                      //得到用户发表的 所有帖子
                      this.saything = res.data.saything[0];
                      this.oldsaything = Object.assign({}, this.saything);
                  }else{
                      alert('登录已经过期！');
                      this.$router.push('/login');
                  }
              })
              .catch(err=>{
                  console.log(err)
              })
        },
        
    },//methods-end
    beforeMount() {
        this.getData();
    },//beforeMount-end


}
</script>

<style scoped>
ul,li{
    list-style: none;
}
#hiddenInput{
    display: none;
}
</style>
