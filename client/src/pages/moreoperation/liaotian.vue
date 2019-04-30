<template>
    <div>
        <!-- 头部标题栏 -->
        <HeadTop title="我的帖子">
            <span slot="left">
                <div @click="routerback">
                    <Icon type="md-arrow-round-back" size="20" /><span>返回</span>
                </div>
            </span>
            <span slot="right"></span>
        </HeadTop>

        <!-- 聊天内容 -->
        <div>
            聊天内容
        </div>
    </div>
</template>

<script>
import store from '../../../vuex/store'
import HeadTop from '../../components/HeadTop/HeadTop'

export default {
    name: "Liaotian",
    //引入vuex
    store,
    //引入子组件
    components: {
        HeadTop,
    },
    data(){
        return {

        }
    },
    //定义各种方法
    methods:{
        routerback(){//后退：返回上一个页面
            this.$router.back(-1);
        },
    },//methods-end
    // 生命周期
    created() {
        const that = this
        this.socket = io.connect('http://193.112.48.157:3333')
        this.socket.on('message', function(obj) {
            that.$store.commit('addroomdetailinfos', obj)
            window.scrollTo(0, 900000)
        })
        this.socket.on('logout', function (obj) {
            that.$store.commit('setusers', obj)
        })
    },//created-end

    
    
}
</script>

<style scoped>

</style>
