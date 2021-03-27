/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue').default;
import moment from 'moment'
import { Form, HasError, AlertError } from 'vform'
window.Form = Form;

import Gate from "./Gate";
Vue.prototype.$gate =  new Gate(window.user);


// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
window.Swal = Swal;


const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

window.Toast = Toast;

Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

Vue.component('pagination', require('laravel-vue-pagination'));



import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
  color: 'rgb(143, 255, 199)',
  failedColor: 'red',
  height: '3px'
})



let routes = [
  { path: '/dashboard', component: require('./components/Dashboard.vue').default },
  { path: '/users', component: require('./components/Users.vue').default },
  { path: '/profile', component: require('./components/Profile.vue').default },
  { path: '/invoice', component: require('./components/Invoice.vue').default },
  { path: '*', component: require('./components/NotFound.vue').default }
]



const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

// make filters global
Vue.filter('upperCase', function(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
});

Vue.filter('humanDateFilter', function(created_at) {
    return moment(created_at).format('MMMM Do YYYY');
});

// to events
window.Fire = new Vue();
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('not-found', require('./components/NotFound.vue').default);
Vue.component('example-component', require('./components/ExampleComponent.vue').default);

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    data: {
        search: ''
    },
    methods: {
        // searchit() {
        //     // console.log('searching ...');
        //     Fire.$emit('searching');
        // } // work fine but i will use lodash use send request after few second

        searchit: _.debounce(() => {
            Fire.$emit('searching');
        },1000) // wait 1 second before send request
    }
});
