import App from '../App.vue';
import Vue from "vue";
import axios from 'axios';
import * as router from './router';
import Router from 'vue-router';

//import Paginate from "vuejs-paginate";
//Vue.component("paginate", Paginate);
Vue.use(Router)

var link = new Vue({
  el: '#link',
  render: h => h(App),
  router: router.default,
  created: function () {
    var self = this;
    axios.interceptors.response.use(
      function (response) { return response; }, // return the response unmodified - noop
      function (error) {
        if (error.response && error.response.status === 403) {
          localStorage.removeItem('token');
          self.loggedin = false;
          self.$router.push('/login');
          location.reload(true);
        } else {
          // Do something with response error
          return Promise.reject(error);
        }
      });
    Vue.prototype.http = axios;
    const token = window.localStorage.getItem('token');
    if (token) {
      const AUTH_TOKEN = 'Bearer ' + token;
      self.http.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    }
  }
});
