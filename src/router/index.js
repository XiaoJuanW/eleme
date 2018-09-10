import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/components/Goods';
import Ratings from '@/components/Ratings';
import Seller from '@/components/Seller';

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [{
    path: '/',
    redirect: '/goods'
  }, {
    path: '/goods',
    component: Goods
  }, {
    path: '/ratings',
    component: Ratings
  }, {
    path: '/seller',
    component: Seller
  }]
})
