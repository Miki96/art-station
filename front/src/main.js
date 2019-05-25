import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
 
Vue.use(Vuetify)


Vue.config.productionTip = false

new Vue({
  router,
  data: {
    user: {
      'id' : localStorage.getItem('id'),
      'token' : localStorage.getItem('token')
    },
    drawer: null
  },
  render: h => h(App)
}).$mount('#app')
