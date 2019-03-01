import Login from '@/views/Login.vue';
import Sessions from '@/views/Sessions.vue';
import Vue from 'vue';
import Router from 'vue-router';

import firebase from 'firebase/app';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/timeline'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/sessions/:view?',
      name: 'talks',
      component: Sessions,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sessions/:id/detail',
      name: 'details',
      component: () => import('./components/SessionDetail.vue'),
      props: true,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/mysessions',
      name: 'mysessions',
      component: () => import('./views/MySessions.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('./views/Calendar.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: () => import('./views/Timeline.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tag/:name',
      name: 'tag',
      component: () => import('./views/Tagged.vue'),
      props: true,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // TODO: firebase.auth().currentUser is null when the page reloads
  //        Need to wrap in a promise and not resolve until callback comes back.
  if (requiresAuth && !currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
