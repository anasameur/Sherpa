import Vue from 'vue';
import Router from 'vue-router';
import Layout from '@/layouts/default';
import handleCallback from '@/components/ImplicitCallBack';

// import Okta Vue SDK
import Auth from '@okta/okta-vue';

// set Okta Configuration
Vue.use(Auth, {
  issuer: process.env.OKTA_ISSUER,
  client_id: process.env.OKTA_CLIENT_ID,
  redirect_uri: `${location.origin}/implicit/callback`,
  scope: 'openid profile email',
});

Vue.use(Router);

/*
                  (!!!!!!!!!!!!!!!!!! must set !!!!!!!!!!!!!!!!!!!!!)
* name:'router-name'             the name is used by <router-link> ':to' directive
                                 the value of the 'to' prop will be passed to router.push()
                                 us name route not specific path for handling nested route
                                 (!!!!!!!!!!!!!!!!!! must set !!!!!!!!!!!!!!!!!!!!!)
* meta : {
    title: 'title'               the name show in submenu (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
*/

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/implicit/callback',
      component: handleCallback,
    },
    {
      path: '*',
      name: 'AllPath',
      redirect: {
        path: '/404',
      },
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/pages/NotFound.vue'),
    },
    {
      path: '/',
      name: 'Root',
      component: Layout,
      redirect: {
        name: 'home',
      },

      // Activate Protected Route
      // Routes are protected by the authRedirectGuard, which verifies
      // there is a valid accessToken or idToken stored.
      // To ensure the user has been authenticated before accessing your route,
      // activate the requiresAuth metadata:

      /* meta: {
        requiresAuth: true,
      }, */
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/pages/accueil.vue'),
          meta: {
            title: 'Home',
            icon: 'home',
          },
        },
        {
          path: 'requests',
          name: 'requests',
          component: () => import('@/pages/demandes.vue'),
          meta: {
            title: 'Requests',
            icon: 'pan_tool',
          },
        },
        {
          path: 'validation',
          name: 'validation',
          component: () => import('@/pages/validation.vue'),
          meta: {
            title: 'Request validation',
            icon: 'done_all',
          },
        },
        {
          path: 'status',
          name: 'status',
          component: () => import('@/pages/habillitationstatus.vue'),
          meta: {
            title: 'Habilitation status',
            icon: 'assignment',
          },
        },
        {
          path: 'help',
          name: 'help',
          component: () => import('@/pages/contacts.vue'),
          meta: {
            title: 'Help & Contacts',
            icon: 'help',
          },
        },
      ],
    },
  ],
});

router.beforeEach(Vue.prototype.$auth.authRedirectGuard());

export default router;
