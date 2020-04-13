import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
		show:false//保存页面reg与log切换凭证
  },
  mutations: {
		set_show(state,val){
			state.show = val
		}
  },
  actions: {

  }
})
