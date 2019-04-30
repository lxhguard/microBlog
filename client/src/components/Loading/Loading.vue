<template>
    <div id="loadBox">
        <Row v-if="this.$store.state.isShow" >
            <Col class="demo-spin-col" span="8" id="loading">
                <Spin fix>
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
            </Col>
        </Row>
    </div>
</template>

<script>
    // 部分样式代码冗长，未作展示
    export default {
        name:"loading",
        
    }
</script>

<style scoped>
    /* 整体居中设置 */
    #loading{
        width:400px;
        height: 400px;
        position: fixed;
        top: 50%;
        left: 50%;
        transform:translate(-200px,-200px);
        z-index: 999;
    }
    /* 加载动画 */
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>

