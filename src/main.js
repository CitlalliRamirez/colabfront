import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueSession from 'vue-session'

Vue.config.productionTip = false
Vue.prototype.$deploy= true
Vue.prototype.$hostname = (Vue.prototype.$deploy)?'https://colabback.herokuapp.com':'http://localhost:8000'

Vue.use(VueSession)

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
