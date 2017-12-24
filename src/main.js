import Vue from 'vue';
import App from './App.vue';
import Buefy from 'buefy';
// import 'buefy/lib/buefy.css';

Vue.use(Buefy, {
  defaultIconPack: 'fa'
});

window.vm = new Vue({
  name:   'app',
  el:     '#app',
  render: h => h(App)
});

