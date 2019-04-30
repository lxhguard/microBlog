<template>
    <div>
        <!-- 头部标题栏 -->
        <header class="msite_header">
            <span class="tab-item">
                <slot name="left"></slot>
            </span>
            <span class="tab-item">
                <slot name="center"></slot>
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
    name:"HeaderBG",
    props:{
        title:String
    }
}
</script>

<style scoped>
.msite_header{
    background-image: url('../../images/kongjianbg.jpeg');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    z-index: 100;
    display: flex;
    width: 100%;
    height: 200px;
}
.tab-item{
    display: flex;
    flex:1;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    font-size:14px;
    color: white;
}

/* 占位盒子：防止导航栏遮挡内容 */
.placehold{
    height: 20px;
    width: 100%;
}
</style>

