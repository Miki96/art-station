import Vue from 'vue'
import Router from 'vue-router'

import Home from './views/Home.vue'
import Profile from './views/Profile.vue'
import Wall from './views/Wall.vue'
import Draw from './views/Draw.vue'
import Favourites from './views/Favourites.vue'
import Account from './views/Account.vue'
import ajax from './http-common.js';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: Home,
      beforeEnter: (to, from, next) => {
        // check if user is logged in
        if (localStorage.getItem('token')) {
          // check if token is valid
          ajax.post('/validate')
          .then(res => {
              // check if response is ID
              next();
          })
          .catch(e => {
            // logout if error
            console.log(e);
            next('/login');
          });
        } else {
          next('/login');
        }
      },
      children: [
        { path: '/', redirect: '/wall' },
        { path: '/profile/:idp', component: Profile },
        { path: '/wall', component: Wall },
        { path: '/draw', component: Draw },
        { path: '/favourites', component: Favourites },
      ]
    },
    { path: '/login', component: Account, props: { tab: 0 }},
    { path: '/signup', component: Account, props: { tab: 1 }}
  ]
})
