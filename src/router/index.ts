import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    //a
    {
      path: '/',
      children: [
        {
          path: '/asset',
          name: 'Asset',
          component: () => import('../views/MasterData/asset/index.vue'),
          meta: {
            title: 'Asset',
          },
        },
        {
          path: '/asset/form',
          name: 'Asset-Form',
          component: () => import('../views/MasterData/asset/form.vue'),
          meta: {
            title: 'Asset-Form',
          },
        },
      ],
    },

    //b
    //c
    {
      path: '/customer',
      name: 'Customer',
      component: () => import('../views/MasterData/customer/index.vue'),
      meta: {
        title: 'Customer',
      },
    },
    {
      path: '/customer/form',
      name: 'Customer-Form',
      component: () => import('../views/MasterData/customer/form.vue'),
      meta: {
        title: 'Customer-Form',
      },
    },
    //d
    //e
    {
      path: '/',
      name: 'Ecommerce',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },

    {
      path: '/employee',
      name: 'Employee',
      component: () => import('../views/MasterData/employee/index.vue'),
      meta: {
        title: 'Employee',
      },
    },
    {
      path: '/employee/form',
      name: 'Employee-Form',
      component: () => import('../views/MasterData/employee/form.vue'),
      meta: {
        title: 'Employee-Form',
      },
    },
    //f
    //g
    //h
    //i
    //i
    //j
    //k
    //l
    //m
    //n
    //o
    //p
    {
      path: '/product',
      name: 'Product',
      component: () => import('../views/MasterData/product/index.vue'),
      meta: {
        title: 'Product',
      },
    },
    {
      path: '/product/form',
      name: 'Product-Form',
      component: () => import('../views/MasterData/product/form.vue'),
      meta: {
        title: 'Product-Form',
      },
    },
    //q
    //r
    {
      path: '/bank-account',
      name: 'Bank Account',
      component: () => import('../views/Others/bank-account/index.vue'),
      meta: {
        title: 'Bank Account',
      },
    },
    {
      path: '/bank-account/form',
      name: 'Bank Account-Form',
      component: () => import('../views/Others/bank-account/form.vue'),
      meta: {
        title: 'Bank Account-Form',
      },
    },
    {
      path: '/account-receivable',
      name: 'Account Receivable',
      component: () => import('../views/Others/account-receivable/index.vue'),
      meta: {
        title: 'Account Recieveable',
      },
    },
    {
      path: '/account-receivable/form',
      name: 'Account Receivable-Form',
      component: () => import('../views/Others/account-receivable/form.vue'),
      meta: {
        title: 'Account Recieveable-Form',
      },
    },
    {
      path: '/account-payable',
      name: 'Account Payable',
      component: () => import('../views/Others/AccountPayable/index.vue'),
      meta: {
        title: 'Account Payable',
      },
    },
    {
      path: '/account-payable/form',
      name: 'Account Payable-Form',
      component: () => import('../views/Others/AccountPayable/form.vue'),
      meta: {
        title: 'Account Payable-Form',
      },
    },

    {
      path: '/laporan-keuangan',
      name: 'Laporan Keuangan', // Financial Report
      component: () => import('../views/Others/LaporanKeuangan/index.vue'),
      meta: {
        title: 'Laporan Keuangan',
      },
    },
    {
      path: '/laporan-keuangan/form',
      name: 'Laporan Keuangan-Form',
      component: () => import('../views/Others/LaporanKeuangan/form.vue'),
      meta: {
        title: 'Laporan Keuangan-Form',
      },
    },

    {
      path: '/laporan-laba-rugi',
      name: 'Laporan Laba Rugi', // Profit and Loss Report
      component: () => import('../views/Others/LaporanLabaRugi/index.vue'),
      meta: {
        title: 'Laporan Laba Rugi',
      },
    },
    {
      path: '/laporan-laba-rugi/form',
      name: 'Laporan Laba Rugi-Form',
      component: () => import('../views/Others/LaporanLabaRugi/form.vue'),
      meta: {
        title: 'Laporan Laba Rugi-Form',
      },
    },
    {
      path: '/opex',
      name: 'Opex',
      component: () => import('../views/Others/OPEX/index.vue'),
      meta: {
        title: 'Opex',
      },
    },
    {
      path: '/quotation',
      name: 'Quotation',
      component: () => import('../views/Others/Quotation/index.vue'),
      meta: {
        title: 'Quotation',
      },
    },
    {
      path: '/quotation/form',
      name: 'Quotation-Form',
      component: () => import('../views/Others/Quotation/form.vue'),
      meta: {
        title: 'Quotation-Form',
      },
    },

    {
      path: '/invoice',
      name: 'Invoice',
      component: () => import('../views/Others/Invoice/index.vue'),
      meta: {
        title: 'Invoice',
      },
    },
    {
      path: '/invoice/form',
      name: 'Invoice-Form',
      component: () => import('../views/Others/Invoice/form.vue'),
      meta: {
        title: 'Invoice-Form',
      },
    },
    {
      path: '/purchase-order',
      name: 'Purchase Order',
      component: () => import('../views/Others/PurchaseOrder/index.vue'),
      meta: {
        title: 'Purchase Order',
      },
    },
    {
      path: '/purchase-order/form',
      name: 'Purchase Order-Form',
      component: () => import('../views/Others/PurchaseOrder/form.vue'),
      meta: {
        title: 'Purchase Order-Form',
      },
    },
    {
      path: '/delivery-order',
      name: 'Delivery Order',
      component: () => import('../views/Others/DeliveryOrder/index.vue'),
      meta: {
        title: 'Delivery Order',
      },
    },
    {
      path: '/delivery-order/form',
      name: 'Delivery Order-Form',
      component: () => import('../views/Others/DeliveryOrder/form.vue'),
      meta: {
        title: 'Delivery Order-Form',
      },
    },
    {
      path: '/report',
      name: 'Report',
      component: () => import('../views/Others/Report/index.vue'),
      meta: {
        title: 'Report',
      },
    },
    {
      path: '/report/form',
      name: 'Report-Form',
      component: () => import('../views/Others/Report/form.vue'),
      meta: {
        title: 'Report-Form',
      },
    },

    //s
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },
    //t
    //u
    //v
    //w
    //x
    //y
    //z

    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   component: () => import('../views/MasterData/UserProfile.vue'),
    //   meta: {
    //     title: 'Profile',
    //   },
    // },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  next()
})
