import Vue from 'vue'
import 'animate.css/animate.min.css'
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru'
import VeeValidate, { Validator } from 'vee-validate'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faChevronDown,
  faCheck,
  faTimesCircle,
  faHourglassHalf,
  faMapMarkerAlt,
  faChild,
  faChalkboardTeacher,
} from '@fortawesome/free-solid-svg-icons'
import {
  faClock,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import store from './store'

library.add(
  faTimes,
  faChevronDown,
  faCheck,
  faTimesCircle,
  faHourglassHalf,
  faMapMarkerAlt,
  faClock,
  faChild,
  faChalkboardTeacher,
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VeeValidate)
Validator.localize('ru')


Vue.filter('formatDate', (date, fmt) => format(date, fmt, { locale: ru }))

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
