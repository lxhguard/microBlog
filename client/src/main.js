// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入store
import store from '../vuex/store'
//引入axios
import Axios from 'axios'
//引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
//引入iview
import iView from "iview";
import "iview/dist/styles/iview.css";
//引入聊天组件
import socketio from './socket'


//使用iview
Vue.use(iView);
//使用element-ui
Vue.use(ElementUI);
//修改原型链，全局使用axios,这样之后可在每个组件的methods中调用$axios命令完成数据请求
// Axios.defaults.withCredentials = true;
Vue.prototype.$axios = Axios
//修改原型链
Vue.prototype.$sockets = socketio


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})



//Axios拦截器配置
//定义一个请求拦截器
Axios.interceptors.request.use(function (config) {
  //在请求发出之前进行一些操作
  //加载圈loading显示
  store.state.isShow = true; 

  console.log("在请求发出之前进行一些操作");

  //将token加在get请求数据中发送给后台
  var localtoken = localStorage.getItem("token");
  // if (config.params){
  //   config.params.token = localtoken;
  // }
  if(localtoken){
    //配置请求头中  Authorization 字段的值为拿到的token
    config.headers['Authorization'] = localtoken;
  }

  // config.headers.common["token"] = localtoken;

  // console.log(config.params);

  
  return config
})
//定义一个响应拦截器
Axios.interceptors.response.use(function (config) {
  //在这里对返回的数据进行处理

  //加载圈loading消失
  store.state.isShow = false;

  console.log("在这里对返回的数据进行处理");
  console.log(config.data);

  


  return config
})
