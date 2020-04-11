<!--Login.vue 用户登录组件-->
<template>
	<div class="login">
		<div class="login_title">
			<span>用户登录</span>
		</div>
		<div class="login_fields">
			<!-- 用户名 -->
			<div class="login_fields__user">
				<div class="icon"><img src="../../assets/img/user_icon_copy.png" alt=""></div>
				<input type="text" placeholder="用户名" v-model="uname" maxlength="16" autocomplete="off">
				<div class="validation" :style="opacity1">
					<img src="../../assets/img/tick.png" alt="">
				</div>
			</div>
			<!-- 密码 -->
			<div class="login_fields__password">
				<div class="icon">
					<img src="../../assets/img/lock_icon_copy.png" alt="">
				</div>
				<input @click="Verification_user" type="text" placeholder="密码" v-model="upwd" maxlength="16" autocomplete="off" >
				<div class="validation" :style="opacity2">
					<img src="../../assets/img/tick.png" alt="">
				</div>
			</div>
			<!-- 验证码 -->
			<div class="login_fields__password">
				<div class="icon">
					<img src="../../assets/img/key.png" alt="">
				</div>
				<input @click="Verification_user" type="text" placeholder="验证码" maxlength="4" autocomplete="off">
				<div class="validation">
					<canvas class="J_codeimg" id="loCanvas">对不起，您的浏览器不支持canvas，请下载最新版浏览器!</canvas>
				</div>
			</div>
			<!-- 登录按钮 -->
			<div class="login_fields__submit">
				<input type="button" value="登录" @click="login">
			</div>
		</div>
		<div class="disclaimer">
			<p>
				欢迎登陆嘟嘟商城
			</p>
		</div>
	</div>

	<!--用户名输入框-->
	<!-- <mt-field label="用户名" placeholder="请输入用户名" v-model="uname"></mt-field> -->
	<!--用户密码输入框-->
	<!-- <mt-field label="密码" placeholder="请输入密码" v-model="upwd"></mt-field> -->
	<!--登录按钮 绑定事件-->
	<!-- <mt-button size="large" @click="login">登录</mt-button> -->

</template>
<script>
	export default {
		data() {
			return {
				opacity1: "opacity:0",
				opacity2: "opacity:0",
				uname: "tom", //用户名
				upwd: 123 //密码
			}
		},
		methods: {
			// 验证账号是否输入
			Verification_user(){
				let u = this.uname
			  let p = this.upwd;
				if(u){
					this.opacity1 = "opacity:1"
				}else{
					this.opacity1 = "opacity:0"
				}
				if(p){
					this.opacity2 = "opacity:1"
				}else{
					this.opacity2 = "opacity:0"
				}
			},
			login(){
				//功能一：完成用户登录操作
				//1：获取用户名和密码 
				var u = this.uname;
				var p = this.upwd;
				//2: 创建正则表达式  3~12位置 字母数字
				var reg = /^[a-z0-9]{3,12}$/i;
				//3: 判断如何错误 用户名提示
				if (!reg.test(u)) {
					this.$toast("用户名格式不正确");
					return;
				}
				//4: 判断如何错误 密码提示
				if (!reg.test(p)) {
					this.$toast("密码格式不正确");
					return;
				}
				//5: 发送ajax axios
				var url = "login";
				var obj = {
					uname: u,
					upwd: p
				};
				this.axios.get(url, {
						params: obj
					}) //parames代表请求的参数
					.then(res => {
						console.log(res);
						//6: 接收服务器返回数据
						//6: 回调函数:接收服务器返回数据
						var code = res.data.code;
						if (code == -1) {
							//7: 失败 提示
							this.$messagebox("消息", "用户名或密码有误");
						} else {
							//8: 成功 跳转
							this.$router.push("/product")
						}
					})

			}
		}
	}
</script>
<style scoped>
	@import url("../../assets/css/login.css");

	.logoNav-header {
		text-align: center;
	}
</style>
