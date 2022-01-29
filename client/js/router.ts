import login from '../components/login/login.vue'
import notFound from '../components/notFound/notFound.vue'
import generated from '../components/generated/generated.vue'
import expired from '../components/expired/expired.vue'
import generateNewLink from '../components/generateNewLink/generateNewLink.vue'
import showFiles from '../components/showFiles/showFiles.vue'
import upload from '../components/upload/upload.vue'
import VueRouter from "vue-router";


const Router = new VueRouter({
  // routes: routes // short for `routes: routes`
  routes: [

    {
      path: '/notFound',
      component: notFound
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/generated/:id',
      component: generated,
      props: true
    },
    {
      path: '/expired',
      component: expired
    },
    {
      path: '/generateNewLink',
      component: generateNewLink
    },
    {
      path: '/files',
      component: showFiles
    },
    {
      path: '/upload/:id',
      component: upload,
      props: true
    },    {
      path: '',
      redirect: '/login'
    },
    {
      path: '*',
      redirect: '/notFound'
    }
  ]
});
export default Router
