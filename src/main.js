import Vue from 'vue'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import 'animate.css/animate.min.css'
import store from './store'
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru'
import VeeValidate, { Validator }  from 'vee-validate'

Vue.use(VeeValidate)
Validator.localize('ru')

Vue.config.productionTip = false

Vue.filter('formatDate', function (date, fmt) {
  return format(date, fmt, { locale: ru })
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
