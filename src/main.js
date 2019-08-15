import Vue from 'vue'
import 'animate.css/animate.min.css'
import { format } from 'date-fns'
import ru from 'date-fns/locale/ru'
import VeeValidate from 'vee-validate'

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
  faCaretLeft,
  faCaretRight,
} from '@fortawesome/free-solid-svg-icons'
import {
  faClock,
  faCalendarAlt,
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import pym from 'pym.js'
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
  faCaretLeft,
  faCaretRight,
  faCalendarAlt,
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(VeeValidate, { locale: 'ru' })
// Validator.localize('ru')

Vue.prototype.$frame = new pym.Child()

Vue.filter('formatDate', (date, fmt) => format(date, fmt, { locale: ru }))

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
}).$mount('#app')
