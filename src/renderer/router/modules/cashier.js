/** When your routing user is too long, you can split it into small modules **/

import Layout from '@/layout'

export default {
  path: '/cashier',
  component: Layout,
  redirect: '/cashier/collect',
  name: 'Cashier',
  meta: {
    title: '收银',
    icon: 'cashier'
  },
  children: [
    {
      path: 'cashier/collect',
      name: 'Collect',
      component: () => import('@/views/cashier/collect'),
      meta: {
        title: '收款',
        icon: 'table',
        permits: ['ui_cashier_collect']
      }
    }
  ]
}
