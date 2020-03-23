import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const EventBus = new Vue();
export default EventBus;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
