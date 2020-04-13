import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './store'
//1.1 完成引入所有组件
import MintUI from "mint-ui" 
//1.2 单引入mint-ui样式文件
import "mint-ui/lib/style.css"
//1.4:引入图标字体文件 
import "./font/iconfont.css"
//1.3 将mint-ui 注册vue
Vue.use(MintUI)
//1.5:引入axios库
import axios from "axios"
//1.6:配置请求时保存session信息 
axios.defaults.withCredentials=true
//1.7:配置请求基础路径(请求后端的接口)
// axios.defaults.baseURL="http://103.45.98.117:8080/"
axios.defaults.baseURL="http://localhost:8010/"
//注意:地址栏请输必须!!!!!!!!!
//http://127.0.0.1:8080/!!!!
//如果地址  http://localhost 报错
//1.8:注册
Vue.prototype.axios = axios;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
