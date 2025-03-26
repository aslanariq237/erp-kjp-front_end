import axios from 'axios'
import { Login } from '@/core/utils/url_api'
import { defineStore } from 'pinia'
import router from '@/router'
import Swal from 'sweetalert2'

interface User {
  id: number
  name: string
  email: string
}

interface authData {
  user: User
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(window.localStorage.getItem('user') || 'null') as User | null,
    token: window.localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuth(data: authData) {
      this.user = data.user
      this.token = data.token
      window.localStorage.setItem('user', JSON.stringify(this.user))
      window.localStorage.setItem('token', data.token)
      router.push('/')
    },

    async login(email: string, password: string) {
      return axios
        .post(Login, {
          email: email,
          password: password,
        })
        .then(({ data }) => {
          this.setAuth(data)
        })
        .catch((err) => {
          Swal.fire({
            icon: 'warning',
            text: err.message,
          })
        })
    },

    async logout() {
      this.user = null
      this.token = null
      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user')
      router.push('/signin')
    },
  },
})
