import Vue from 'vue';
import '@fortawesome/fontawesome-free/css/all.css';
import 'animate.css/animate.min.css';
import { format } from 'date-fns';
import ru from 'date-fns/locale/ru';
import VeeValidate, { Validator } from 'vee-validate';
import store from './store';
import App from './App.vue';

Vue.use(VeeValidate);
Validator.localize('ru');

Vue.config.productionTip = false;

Vue.filter('formatDate', (date, fmt) => format(date, fmt, { locale: ru }));

new Vue({
  render: h => h(App),
  store,
}).$mount('#app');
