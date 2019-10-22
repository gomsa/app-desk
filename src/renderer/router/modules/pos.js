/** When your routing user is too long, you can split it into small modules **/

import Layout from '@/layout'

export default {
  path: '/pos',
  component: Layout,
  redirect: '/pos/index',
  name: 'Pos',
  meta: {
    title: '收银',
    icon: 'pos'
  },
  children: [
    {
      path: 'pos/index',
      name: 'Pos',
      component: () => import('@/views/pos/index'),
      meta: {
        title: '收款',
        icon: 'table',
        permits: ['ui_pos_index']
      }
    }
  ]
}
