import Vue from 'vue'
import Router from 'vue-router'
import log from "./components/xz/log.vue"
//(1)登录组件
// import Login from "./components/xz/Login.vue"
// 商品列表
import Product from "./components/xz/product.vue"
// 购物车
import Cart from "./components/xz/Cart.vue"
Vue.use(Router)

export default new Router({
	routes: [
		// {
		//   path: '/',
		//   name: 'login',
		//   component: login
		// },

		// {path:'/',component:Login},
		// { path: '/', component: Login },
		{
			path: '/',
			component: log,
			// children: [{
			// 		path: 'login',
			// 		component: Login
			// 	},
				// {
				// 	path: 'posts',
				// 	component: UserPosts
				// }
			// ]
		},
		// {path:'/Login',component:Login},
		{
			path: '/Product',
			component: Product
		},
		{
			path: '/Cart',
			component: Cart
		},
		// {
		//   path: '/about',
		//   name: 'about',
		//   // route level code-splitting
		//   // this generates a separate chunk (about.[hash].js) for this route
		//   // which is lazy-loaded when the route is visited.
		//   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
		// }
	]
})
