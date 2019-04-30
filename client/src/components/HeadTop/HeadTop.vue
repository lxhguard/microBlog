<template>
    <div>
        <!-- 头部标题栏 -->
        <header class="msite_header">
            <span class="tab-item">
                <slot name="left"></slot>
            </span>
            <span class="tab-item">
                <span class="header_title_text ellipsis">{{title}}</span>
            </span>
            <span class="tab-item">
                <slot name="right"></slot>
            </span>          
        </header>
        <!-- 占位盒子：防止导航栏遮挡内容 -->
        <div class="placehold"></div>
    </div>
</template>

<script>
export default {
    name:"HeadTop",
    props:{
        title:String
    }
}
</script>

<style scoped>
.msite_header{
    background-image: url('../../../static/images/head_bg.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    position: fixed;
    z-index: 100;
    display: flex;
    left: 0;
    top: 0;
    width: 100%;
    height: 41px;
}
.tab-item{
    display: flex;
    flex:1;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    font-size:14px;
    color: black;
}

/* 占位盒子：防止导航栏遮挡内容 */
.placehold{
    height: 41px;
    width: 100%;
}
</style>

