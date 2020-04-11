<template>
<!-- 购物车 -->
    <div class="cart">
        <!-- 顶部复选框:全选功能 -->
        <div class="selectall" @click="selectAll">
            全选<input type="checkbox"/>
        </div>
        <!-- 商品列表 -->
        <div v-for="(item,index) of list" :key="index" class="cart-item">
            <div class="leftText">
                <input type="checkbox" v-model="item.cd" />
                <div class="lname">{{item.lname}}</div>
                <div class="price">{{item.price}}</div>
            </div>
            <mt-button @click="deleteItem" :data-id="item.id">删除</mt-button>
        </div>
        <!-- 购物车商品中的数量 -->
        <div>
            <span style="color:red">0</span>
            <mt-button @click="deleteItems">删除选中商品</mt-button>
            <!-- <mt-button>清空购物车</mt-button> -->
        </div>

    </div>
</template>
<script>
export default {
    
    data(){
        return{
            list:[]//当前登录用户购物车列表
        }
    },
    created(){//当前组建创建成功后回调函数
        this.loadMore();
    },
    methods:{
        // 全选按钮
        selectAll(event){
            // 获取当前按钮状态
            var cb=event.target.checked;
            // 遍历所有商品属性cd值与全选cb状态一致
            for(var item of this.list){
                item.cd=cb;
            }
        },
        // 删除多个商品
        deleteItems(){
            // 1显示确认对话框
            this.$messagebox.confirm("是否删除选中商品").then(res=>{
            // 2创建变量保存id值
            var id="";
            // 3创建循环遍历数组中每个元素
            for(var item of this.list){
            // 4判断当前元素cd属性是否为真
                if(item.cd){
            // 5拼接id 2，3，4，
                    id+=item.id+","
                }
            }
            // （因为多一个,号）去除最后一个逗号
            id=id.slice(0,-1);//去掉倒数第一那个字符串
            // 6判断商品是否被选中
            if(id==""){
                this.$toast("请选择需要删除的商品");
                return;
            }
            // 7创建url 创建obj 发送ajax请求
            var url="delItems";
            var obj={id:id};
            this.axios.get(url,{params:obj}).then(res=>{
            // 8获取服务器返回数据
            if(res.data.code==-1){
            // 9判断是否删除成功
                this.$toast("删除失败");
            }else{
                this.$toast("删除成功");
            // 刷新
                this.loadMore();
            }
                })
            }).catch(err=>{})
        },
        // 点击删除按钮删除指定数据
        deleteItem(event){
            // 显示确认
            this.$messagebox.confirm("是否删除指定数据")//confirm确定提示框
            .then(res=>{
            // 获取id
                var id=event.target.dataset.id;
            // 发送ajax请求
                var url="delItem";
                var obj={id:id};
                this.axios.get(url,{params:obj})
                .then(res=>{
                    // 提示删除成功
                    if(res.data.code==1){
                    this.$toast("删除成功");
                    // 刷新（查询）
                    this.loadMore();
                    }else{
                        this.$toast("删除失败")
                    }
                })
            // 
            }).catch(err=>{

            })
        },
        loadMore(){
            // 获取购物车
            // 创建url
            var url="carts"//服务器接口的一致(不用加/)
            // 发送ajax请求
            this.axios.get(url).then(res=>{
                if(res.data.code==-1){
                    // 如果服务器返回-1
                    this.$messagebox("消息","请登录")
                    .then(res=>{
                        // 回调函数，(用户点击确定后才跳)
                        this.$router.push("/Login")
                    })
                }else{
                    // this.list=res.data.data;
                    // console.log(this.list);
                    // 添加一个新功能
                    // 创建循环遍历res.data.data中数据
                    var rows=res.data.data;
                    for(var item of rows){
                        // 为其添加属性
                        item.cd=false;
                    }
                        // 将新值又付给list
                        this.list=rows;
                }
            })
            // 获取服务器返回数据
        }
    }
}
</script>
<style scoped>
/* 商品项目元素 */
.cart-item{
    display:flex;
    justify-content: space-between;/*两端对齐*/
    align-items: center;/*垂直居中*/
    border-bottom: 1px solid #ccc;
    margin-top:25px;
}
/* 左侧文字 复选框 */
.leftText{
    display: flex;
    align-items: center;
}
/* 商品名称 */
.lname{
    margin-left: 25px;
}
.price{
    margin-left: 5px;
}
</style>