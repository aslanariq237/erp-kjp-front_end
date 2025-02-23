import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    //a
    {
      path: "/",
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
      ]
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
