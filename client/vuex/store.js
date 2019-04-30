import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

/* 共享数据 */
const state = {
    //  默认loading未加载完毕
    isShow: false,
    //聊天室的信息
  //存放用户
  user: {
    name: '',
    src: ''
  },
  //存放历史记录
  messhistory: {
    infos: []
  },
  //存放房间信息，为了方便以后做多房间
  roomdetail: {
    id: '',
    users: {},
    infos: []
  },
  //存放机器人开场白
  robotmsg: [{
    message: 'Hi~有什么想知道的可以问我',
    user: 'robot'
  }],
  //聊天页面显示控制
  chattoggle: false,
  //登录页面显示控制
  logintoggle: false,
  //注册页面显示控制
  registertoggle: true,
  //提示框显示控制
  dialog: false,
  //提示框内容
  dialoginfo: '',
  //聊天室信息---end
    // //  从node接收的alert状态;内容;用户名
    // showAlert:false,
    // Nodestatus:0,
    // Nodecontent:'',
    // Nodename:'',
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
};

/* 数据存入数据库的 API ,用来修改state */
const mutations = {
  // 修改token，并将token存入localStorage
  changeLogin(state, user) {
    state.Authorization = user.Authorization;
    localStorage.setItem('Authorization', user.Authorization);
  }
}

/* 从数据库（state）中取 */
const getters = {

}

/* 数据的中间处理 */
const action = {

}

export default new Vuex.Store({
  state,
  mutations,
  getters,
  action
});