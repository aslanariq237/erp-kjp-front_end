import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'User Dashbiard',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'eCommerce Dashboard',
      },
    },
    //a
    {
      path: '/admin-dashboard',
      name: 'Admin Dashboard',
      component: () => import('../views/Others/adminDashboard/index.vue'),
      meta: {
        title: 'Admin Dashboard',
      },
    },

    {
      path: '/asset',
      children: [
        {
          path: '',
          name: 'Asset',
          component: () => import('../views/MasterData/asset/index.vue'),
          meta: {
            title: 'Asset',
          },
        },
        {
          path: 'form',
          name: 'Asset-Form',
          component: () => import('../views/MasterData/asset/form.vue'),
          meta: {
            title: 'Asset-Form',
          },
        },
        {
          path: 'edit/:id',
          name: 'Asset-Edit',
          component: () => import('../views/MasterData/asset/form.vue'),
          meta: {
            title: 'Asset-Form',
          },
        },
      ],
    },
    {
      path: '/account-receivable',
      children: [
        {
          path: '',
          name: 'Account Receivable',
          component: () => import('../views/Others/account-receivable/index.vue'),
          meta: {
            title: 'Account Recieveable',
          },
        },
        {
          path: 'form',
          name: 'Account Receivable-Form',
          component: () => import('../views/Others/account-receivable/form.vue'),
          meta: {
            title: 'Account Recieveable-Form',
          },
        },
      ],
    },
    {
      path: '/account-payable',
      children: [
        {
          path: '',
          name: 'Account Payable',
          component: () => import('../views/Others/AccountPayable/index.vue'),
          meta: {
            title: 'Account Payable',
          },
        },
        {
          path: 'form',
          name: 'Account Payable-Form',
          component: () => import('../views/Others/AccountPayable/form.vue'),
          meta: {
            title: 'Account Payable-Form',
          },
        },
      ],
    },

    //b
    //c
    {
      path: '/customer',
      children: [
        {
          path: '',          
          component: () => import('../views/MasterData/customer/index.vue'),
          meta: {
            title: 'Customer',
          },
        },
        {
          path: 'form',          
          component: () => import('../views/MasterData/customer/form.vue'),
          meta: {
            title: 'Customer-Form',
          },
        },
        {
          path: 'edit/:id',          
          component: () => import('../views/MasterData/customer/form.vue'),
          meta: {
            title: 'Customer-Edit',
          },
        },
      ],
    },
    //d
    {
      path: '/delivery-order',
      children: [
        {
          path: '',
          component: () => import('../views/Others/DeliveryOrder/index.vue'),
          meta: {
            title: 'Delivery Order',
          },
        },
        {
          path: 'form',
          component: () => import('../views/Others/DeliveryOrder/form.vue'),
          meta: {
            title: 'Delivery Order-Form',
          },
        },
        {
          path: 'view/:id',
          component: () => import('../views/Others/DeliveryOrder/view.vue'),
          meta: {
            title: 'Delivery Order-View',
          },
        },
      ],
    },
    {
      path: '/document',
      children: [
        {
          path: '',
          component: () => import('../views/MasterData/document/index.vue'),
          meta: {
            title: 'Delivery Order',
          },
        },
        {
          path: 'form',
          component: () => import('../views/MasterData/document/form.vue'),
          meta: {
            title: 'Delivery Order-Form',
          },
        },        
      ],
    },
    //e
    {
      path: '/employee',
      children: [
        {
          path: '',
          name: 'Employee',
          component: () => import('../views/MasterData/employee/index.vue'),
          meta: {
            title: 'Employee',
          },
        },
        {
          path: 'form',
          name: 'Employee-Form',
          component: () => import('../views/MasterData/employee/form.vue'),
          meta: {
            title: 'Employee-Form',
          },
        },
        {
          path: 'edit/:id',
          name: 'Employee-Edit',
          component: () => import('../views/MasterData/employee/form.vue'),
          meta: {
            title: 'Employee-Form',
          },
        },
      ],
    },
    //f
    {
      path: '/faktur-pajak',
      children: [
        {
          path: '',
          name: 'Faktur Pajak',
          component: () => import('../views/Others/faktur-pajak/index.vue'),
          meta: {
            title: 'Faktur Pajak',
          },
        },
        {
          path: '/faktur-pajak/form',
          name: 'Faktur Pajak-form',
          component: () => import('../views/Others/faktur-pajak/form.vue'),
          meta: {
            title: 'Faktur Pajak',
          },
        },
      ],
    },
    //g
    {
      path: '/good-receive',
      children: [
        {
          path: '',          
          component: () => import('../views/Others/GoodReceive/index.vue'),
          meta: {
            title: 'Good-Receive',
          },
        },
        {
          path: 'add/:id',          
          component: () => import('../views/Others/GoodReceive/form.vue'),
          meta: {
            title: 'Good-Receive-View',
          },
        },
      ],
    },
    //h
    //i
    {
      path: '/invoice',
      children: [
        {
          path: '',
          name: 'Invoice',
          component: () => import('../views/Others/Invoice/index.vue'),
          meta: {
            title: 'Invoice',
          },
        },
        {
          path: 'form',          
          component: () => import('../views/Others/Invoice/form.vue'),
          meta: {
            title: 'Invoice-Form',
          },
        },
        {
          path: 'edit/:id',          
          component: () => import('../views/Others/Invoice/form.vue'),
          meta: {
            title: 'Invoice-Edit',
          },
        },
        {
          path: 'view/:id',          
          component: () => import('../views/Others/Invoice/view.vue'),
          meta: {
            title: 'Invoice-View',
          },
        },
      ],
    },
    {
      path: '/inquiry',
      children: [
        {
          path: '',
          name: 'Inquiry',
          component: () => import('../views/Operation/Inquiry/index.vue'),
          meta: {
            title: 'Inquiry',
          },
        },
        {
          path: 'form',
          name: 'Inquiry-Form',
          component: () => import('../views/Operation/Inquiry/form.vue'),
          meta: {
            title: 'Inquiry-Form',
          },
        },
      ],
    },
    //j
    //k
    //l
    {
      path: '/laporan-keuangan',
      children: [
        {
          path: '',
          name: 'Laporan Keuangan', // Financial Report
          component: () => import('../views/Others/LaporanKeuangan/index.vue'),
          meta: {
            title: 'Laporan Keuangan',
          },
        },
        {
          path: 'form',
          name: 'Laporan Keuangan-Form',
          component: () => import('../views/Others/LaporanKeuangan/form.vue'),
          meta: {
            title: 'Laporan Keuangan-Form',
          },
        },
      ],
    },
    {
      path: '/laporan-laba-rugi',
      children: [
        {
          path: '',
          name: 'Laporan Laba Rugi', // Profit and Loss Report
          component: () => import('../views/Others/LaporanLabaRugi/index.vue'),
          meta: {
            title: 'Laporan Laba Rugi',
          },
        },
        {
          path: 'form',
          name: 'Laporan Laba Rugi-Form',
          component: () => import('../views/Others/LaporanLabaRugi/form.vue'),
          meta: {
            title: 'Laporan Laba Rugi-Form',
          },
        },
      ],
    },
    //m
    //n
    //o
    {
      path: '/opex',
      children: [
        {
          path: '',
          name: 'Opex',
          component: () => import('../views/Others/OPEX/index.vue'),
          meta: {
            title: 'Opex',
          },
        },
        {
          path: 'form',
          name: 'Opex Form',
          component: () => import('../views/Others/OPEX/form.vue'),
          meta: {
            title: 'Opex Form',
          },
        },
      ],
    },
    //p
    {
      path: '/product',
      children: [
        {
          path: '',
          name: 'Product',
          component: () => import('../views/MasterData/product/index.vue'),
          meta: {
            title: 'Product',
          },
        },
        {
          path: 'form',
          name: 'Product-Form',
          component: () => import('../views/MasterData/product/form.vue'),
          meta: {
            title: 'Product-Form',
          },
        },
      ],
    },
    {
      path: '/purchase-order',
      children: [
        {
          path: '',
          name: 'Purchase Order',
          component: () => import('../views/Operation/PurchaseOrder/index.vue'),
          meta: {
            title: 'Purchase Order',
          },
        },
        {
          path: 'form',
          name: 'Purchase Order-Form',
          component: () => import('../views/Operation/PurchaseOrder/form.vue'),
          meta: {
            title: 'Purchase Order-Form',
          },
        },
        {
          path: 'view/:id',
          component: () => import('../views/Operation/PurchaseOrder/view.vue'),
          meta: {
            title: 'Purchase Order-View',
          },
        },
        {
          path: 'edit/:id',
          component: () => import('../views/Operation/PurchaseOrder/form.vue'),
          meta: {
            title: 'Purchase Order-Form',
          },
        },
      ],
    },
    //q
    {
      path: '/quotation',
      children: [
        {
          path: '',
          component: () => import('../views/Others/Quotation/index.vue'),
          meta: {
            title: 'Quotation',
          },
        },
        {
          path: 'form',
          component: () => import('../views/Others/Quotation/form.vue'),
          meta: {
            title: 'Quotation-Form',
          },
        },
        {
          path: 'view/:id',
          component: () => import('../views/Others/Quotation/view.vue'),
          meta: {
            title: 'Quotation-Form',
          },
        },
        {
          path: 'edit/:id',
          component: () => import('../views/Others/Quotation/form.vue'),
          meta: {
            title: 'Quotation-Form',
          },
        },
      ],
    },
    //r
    {
      path: '/report',
      children: [
        {
          path: 'sales',
          name: 'Report',
          component: () => import('../views/Others/Report/indexsales.vue'),
          meta: {
            title: 'Report',
          },
        },
        {
          path: 'scm',
          name: 'Report-Form',
          component: () => import('../views/Others/Report/indexscm.vue'),
          meta: {
            title: 'Report-Form',
          },
        },
      ],
    },

    {
      path: '/opex',
      name: 'Opex',
      component: () => import('../views/Others/OPEX/index.vue'),
      meta: {
        title: 'Opex',
      },
    },

    //s
    {
      path: '/stock',
      children: [
        {
          path: '',
          name: 'Stock',
          component: () => import('../views/Others/Stock/index.vue'),
          meta: {
            title: 'Product',
          },
        },        
      ],
    },
    {
      path: '/sales-order',
      children: [
        {
          path: '',
          name: 'Sales Order',
          component: () => import('../views/Operation/SalesOrder/index.vue'),
          meta: {
            title: 'Sales Order',
          },
        },
        {
          path: 'form',
          component: () => import('../views/Operation/SalesOrder/form.vue'),
          meta: {
            title: 'Sales Order-Form',
          },
        },
        {
          path: 'view/:id',
          component: () => import('../views/Operation/SalesOrder/view.vue'),
          meta: {
            title: 'Sales Order-Form',
          },
        },
        {
          path: 'edit/:id',
          component: () => import('../views/Operation/SalesOrder/form.vue'),
          meta: {
            title: 'Sales Order-Form',
          },
        },
      ],
    },
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
    {
      path: '/tanda-terima',
      children: [
        {
          path: '',
          component: () => import('../views/Others/TandaTerima/index.vue'),
          meta: {
            title: 'Tanda Terima',
          },
        },
        {
          path: 'form',
          component: () => import('../views/Others/TandaTerima/form.vue'),
          meta: {
            title: 'Tanda Terima Form',
          },
        },
        {
          path: 'view/:id',
          component: () => import('../views/Others/TandaTerima/form.vue'),
          meta: {
            title: 'Tanda Terima View',
          },
        },
        {
          path: 'edit/:id',
          component: () => import('../views/Others/TandaTerima/form.vue'),
          meta: {
            title: 'Tanda Terima Form',
          },
        },
      ],
    },
    //u
    //v
    {
      path: '/vendor',
      children: [
        {
          path: '',
          component: () => import('../views/MasterData/Vendor/index.vue'),
          meta: {
            title: 'Vendor',
          },
        },
        {
          path: 'form',
          component: () => import('../views/MasterData/Vendor/form.vue'),
          meta: {
            title: 'Vendor',
          },
        },
        {
          path: 'edit/:id',
          component: () => import('../views/MasterData/Vendor/form.vue'),
          meta: {
            title: 'Vendor Edit',
          },
        },
      ],
    },
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
    // {
    //   path: '/line-chart',
    //   name: 'Line Chart',
    //   component: () => import('../views/Chart/LineChart/LineChart.vue'),
    // },
    // {
    //   path: '/bar-chart',
    //   name: 'Bar Chart',
    //   component: () => import('../views/Chart/BarChart/BarChart.vue'),
    // },
    // {
    //   path: '/alerts',
    //   name: 'Alerts',
    //   component: () => import('../views/UiElements/Alerts.vue'),
    //   meta: {
    //     title: 'Alerts',
    //   },
    // },
    // {
    //   path: '/avatars',
    //   name: 'Avatars',
    //   component: () => import('../views/UiElements/Avatars.vue'),
    //   meta: {
    //     title: 'Avatars',
    //   },
    // },
    // {
    //   path: '/badge',
    //   name: 'Badge',
    //   component: () => import('../views/UiElements/Badges.vue'),
    //   meta: {
    //     title: 'Badge',
    //   },
    // },

    // {
    //   path: '/buttons',
    //   name: 'Buttons',
    //   component: () => import('../views/UiElements/Buttons.vue'),
    //   meta: {
    //     title: 'Buttons',
    //   },
    // },

    // {
    //   path: '/images',
    //   name: 'Images',
    //   component: () => import('../views/UiElements/Images.vue'),
    //   meta: {
    //     title: 'Images',
    //   },
    // },
    // {
    //   path: '/videos',
    //   name: 'Videos',
    //   component: () => import('../views/UiElements/Videos.vue'),
    //   meta: {
    //     title: 'Videos',
    //   },
    // },

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
