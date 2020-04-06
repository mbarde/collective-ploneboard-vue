import Vue from 'vue'
import Router from 'vue-router'
import Conversation from '@/components/Conversation'
import Login from '@/components/Login'
import MessageBoard from '@/components/MessageBoard'
import Topic from '@/components/Topic'
import Welcome from '@/components/Welcome'

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
      path: '/:boardId',
      name: 'MessageBoard',
      component: MessageBoard
    },
    {
      path: '/:boardId/:topicId',
      name: 'Topic',
      component: Topic
    },
    {
      path: '/:boardId/:topicId/:conversationId',
      name: 'Conversation',
      component: Conversation
    },
  ]
})
