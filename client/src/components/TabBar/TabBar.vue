<template>
    <div>
        <!-- 占位盒子：防止导航栏遮挡内容 -->
        <div class="placehold"></div>
        <div class="index">
            <div class="headertop">
                <span class="tab-item" @click="GoTo('/world')" :class="{on: '/world' === $route.path}">
                    <Icon type="md-planet" size="20" />
                    <span>
                        首页
                    </span>
                </span>
                <span class="tab-item" @click="GoTo('/discuss')" :class="{on: '/discuss' === $route.path}">
                    <Icon type="md-list-box" size="20" />
                    <span>
                        实时聊天
                    </span>
                </span>
                <span class="tab-item"  >
                    <Icon type="md-add-circle" size="30"/>
                </span>
                <span class="tab-item" @click="GoTo('/samecity')" :class="{on: '/samecity' === $route.path}">
                    <Icon type="ios-home" size="20" />
                    <span>
                        搜索
                    </span>
                </span>
                <span class="tab-item" @click="GoTo('/me')" :class="{on: '/me' === $route.path}">
                    <Icon type="md-person" size="20" />
                    <span>
                        我的
                    </span>
                </span>
            </div>               
        </div>
    </div>
</template>

<script>
export default {
    name:"TabBar",
    methods:{
        GoTo(path){
            this.$router.replace(path);
        },
        
        
    }
}
</script>

<style scoped>
.headertop{
    width:100%;
    background-image: url('../../images/tabbar_bg.jpeg');
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    z-index: 999;
}
.tab-item{
    display: flex;
    flex:1;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    font-size:14px;
    color: #fff;
}
.tab-item img{
    width:40px;
}
.on{
    background-color: white;
    /* color:#19be6b; */
    background-image: url('../../images/tabbar_on.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
}
/* 占位盒子：防止导航栏遮挡内容 */
.placehold{
    height: 41px;
    width: 100%;
}

</style>