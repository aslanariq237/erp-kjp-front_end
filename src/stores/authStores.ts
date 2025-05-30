import axios from 'axios'
import { Login } from '@/core/utils/url_api'
import { defineStore } from 'pinia'
import router from '@/router'
import Swal from 'sweetalert2'
import JwtServices from '@/core/services/JwtServices'

interface User {
  id: number
  name: string
  email: string
}

interface authData {
  user: Array<User>
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JwtServices.getData(),
    token: window.localStorage.getItem('token'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    users: (state) => state.user,
  },

  actions: {
    setAuth(data: authData) {
      this.token = data.token
      JwtServices.saveData(JSON.stringify(data.user))
      window.localStorage.setItem('user', JSON.stringify(data.user));
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
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Email or Password is incorrect!',
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
              })
            }
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Network Error!',
            })
          }
        });
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
