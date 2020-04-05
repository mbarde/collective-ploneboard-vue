import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '@/components/Welcome'
import Login from '@/components/Login'
import MessageBoard from '@/components/MessageBoard'
import Topic from '@/components/Topic'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/board/:boardId',
      name: 'MessageBoard',
      component: MessageBoard
    },
    {
      path: '/board/:boardId/:topicId',
      name: 'Topic',
      component: Topic
    },
  ]
})
