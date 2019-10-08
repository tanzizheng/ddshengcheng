<template>
    <div class="product-app">
        <!-- <h1>商品列表</h1> -->
        <!-- 此div表示一个商品 -->
        <div class="goods-item" v-for="(item,index) of list
        " :key="index" >
            <img :src="'http://127.0.0.1:8080/'+item.img_url" alt="">
            <!-- 名称 -->
            <h5>{{item.lname}}</h5>
            <!-- 价格 -->
            <div class="info">1258.998</div>
            <!-- 加入购物车 -->
            <!-- 添加自定义属性 -->
            <mt-button @click="addcart" :data-lid="item.lid"
            :data-price="item.price" :data-lname="item.lname">加入购物车</mt-button>
        </div>
        <mt-button size="large" @click="loadMore">加载更多</mt-button>
        <mt-button @click="jmpCart">查看购物车</mt-button>
    </div>
</template>
<script>
export default {
    data(){
        return{
            list:[],//保存商品
            pno:0//当前页码
        }
    },
    created(){//周期函数(页面渲染)
        this.loadMore();
    },
    methods:{
        jmpCart(){
            // 跳转购物车组件
            this.$router.push("/Cart");
        },
        addcart(event){
            // 取自定义属性
            var lid=event.target.dataset.lid;
            var lname=event.target.dataset.lname;
            var price=event.target.dataset.price;
            // console.log(lid+"|"+lname+"|"+price);
            var url="addcart";//发送给服务器
            var obj={lid:lid,lname:lname,price:price};
            // 发送ajax请求
            this.axios.get(url,{params:obj}).then
            (res=>{
                console.log(res);
                if(res.data.code==-1){
                    // this.$messagebox("消息","请登录");异步，会很快跳转所以要把跳转放在回调里面
                    this.$messagebox("消息","请登录")
                    .then(res=>{
                        //调转
                        this.$router.push("/login");
                    });
                }else if(res.data.code == -2){
                    this.$messagebox("消息","添加失败");
                }else{
                this.$messagebox("消息","添加成功");
                } 
            })
        },
        loadMore(){
            // 创建url
            var url="product";//这个跟服务器接收的一样
            // 当前页码加一
            this.pno++;
            var obj={pno:this.pno}
            // 获取第一页数据
            this.axios.get(url,{params:obj}).then(res=>{
                console.log(res.data.data);
                // this.list=res.data.data;//只显示一页
                // 数组拼接，多页显示
                var rows=this.list.concat(res.data.data);
                this.list=rows;
            })
        }
    }    
}
</script>
<style scoped>
    /* 最外层弹性布局 */
.product-app{
    display:flex;
    flex-wrap: wrap;/*指定子元素换行*/
    justify-content: space-between;/*两端对齐*/
    padding: 4px;
}
/* 商品修饰 */
.goods-item{
    /* 因为一行只有两个商品 */
    width:49%;
    border: 1px solid #ccc;
    border-radius: 5px;/*圆角*/
    margin:2px 0;
    padding: 2px;
    box-sizing: border-box;/*重新计算元素宽度*/
    display: flex;
    flex-direction: column;/*商品内容按列排放*/
    min-height: 249px;/*最小高度*/
}
/* 价格 */
.goods-item .info{
    color: red;
    font-size: 19px;
}
/* 图片 */
.product-app .goods-item img{
    width: 200px;
    height: 250px;
}
</style>