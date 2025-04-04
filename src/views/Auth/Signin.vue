<template>
  <div class="flex w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 to-indigo-950">
    <!-- Login Section -->
    <div class="flex flex-col w-full lg:w-1/2 p-8 md:p-12 justify-center">
      <!-- Logo & Back Button -->
      <div class="w-full max-w-md mx-auto mb-8">
        <router-link
          to="/"
          class="inline-flex items-center text-sm text-white/70 transition-colors hover:text-white"
        >
          <svg
            class="stroke-current mr-2"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Kembali ke Beranda
        </router-link>
      </div>

      <!-- Login Form Container -->
      <div class="w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-white mb-2">Selamat Datang Kembali</h1>
          <p class="text-white/70">Masuk untuk melanjutkan</p>
        </div>

        <!-- Social Login Options -->
        <div class="grid grid-cols-1 gap-4 mb-6">
          <button
            class="flex items-center justify-center gap-3 py-3 text-sm font-medium text-white bg-white/20 hover:bg-white/30 transition-all rounded-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                fill="#4285F4"
              />
              <path
                d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                fill="#34A853"
              />
              <path
                d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                fill="#FBBC05"
              />
              <path
                d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                fill="#EB4335"
              />
            </svg>
            <span>Masuk dengan Google</span>
          </button>
        </div>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 py-1 text-white/60 bg-transparent">atau</span>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleSubmit">
          <div class="space-y-5">
            <!-- Email -->
            <div>
              <label for="email" class="mb-1.5 block text-sm font-medium text-white/80">
                Email
              </label>
              <input
                v-model="email"
                type="email"
                id="email"
                name="email"
                placeholder="email@perusahaan.com"
                class="h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/40 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400/20"
              />
            </div>

            <!-- Password -->
            <div>
              <div class="flex justify-between mb-1.5">
                <label for="password" class="block text-sm font-medium text-white/80">
                  Password
                </label>
                <router-link to="/reset-password" class="text-xs text-blue-400 hover:text-blue-300">
                  Lupa password?
                </router-link>
              </div>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  placeholder="Masukkan password"
                  class="h-12 w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-4 pr-11 text-white placeholder:text-white/40 focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-400/20"
                />
                <span
                  @click="togglePasswordVisibility"
                  class="absolute z-30 text-white/60 -translate-y-1/2 cursor-pointer right-4 top-1/2 hover:text-white"
                >
                  <svg
                    v-if="!showPassword"
                    class="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10.0002 13.8619C7.23361 13.8619 4.86803 12.1372 3.92328 9.70241C4.86804 7.26761 7.23361 5.54297 10.0002 5.54297C12.7667 5.54297 15.1323 7.26762 16.0771 9.70243C15.1323 12.1372 12.7667 13.8619 10.0002 13.8619ZM10.0002 4.04297C6.48191 4.04297 3.49489 6.30917 2.4155 9.4593C2.3615 9.61687 2.3615 9.78794 2.41549 9.94552C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C13.5184 15.3619 16.5055 13.0957 17.5849 9.94555C17.6389 9.78797 17.6389 9.6169 17.5849 9.45932C16.5055 6.30919 13.5184 4.04297 10.0002 4.04297ZM9.99151 7.84413C8.96527 7.84413 8.13333 8.67606 8.13333 9.70231C8.13333 10.7286 8.96527 11.5605 9.99151 11.5605H10.0064C11.0326 11.5605 11.8646 10.7286 11.8646 9.70231C11.8646 8.67606 11.0326 7.84413 10.0064 7.84413H9.99151Z"
                    />
                  </svg>
                  <svg
                    v-else
                    class="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.63803 3.57709C4.34513 3.2842 3.87026 3.2842 3.57737 3.57709C3.28447 3.86999 3.28447 4.34486 3.57737 4.63775L4.85323 5.91362C3.74609 6.84199 2.89363 8.06395 2.4155 9.45936C2.3615 9.61694 2.3615 9.78801 2.41549 9.94558C3.49488 13.0957 6.48191 15.3619 10.0002 15.3619C11.255 15.3619 12.4422 15.0737 13.4994 14.5598L15.3625 16.4229C15.6554 16.7158 16.1302 16.7158 16.4231 16.4229C16.716 16.13 16.716 15.6551 16.4231 15.3622L4.63803 3.57709ZM12.3608 13.4212L10.4475 11.5079C10.3061 11.5423 10.1584 11.5606 10.0064 11.5606H9.99151C8.96527 11.5606 8.13333 10.7286 8.13333 9.70237C8.13333 9.5461 8.15262 9.39434 8.18895 9.24933L5.91885 6.97923C5.03505 7.69015 4.34057 8.62704 3.92328 9.70247C4.86803 12.1373 7.23361 13.8619 10.0002 13.8619C10.8326 13.8619 11.6287 13.7058 12.3608 13.4212ZM16.0771 9.70249C15.7843 10.4569 15.3552 11.1432 14.8199 11.7311L15.8813 12.7925C16.6329 11.9813 17.2187 11.0143 17.5849 9.94561C17.6389 9.78803 17.6389 9.61696 17.5849 9.45938C16.5055 6.30925 13.5184 4.04303 10.0002 4.04303C9.13525 4.04303 8.30244 4.17999 7.52218 4.43338L8.75139 5.66259C9.1556 5.58413 9.57311 5.54303 10.0002 5.54303C12.7667 5.54303 15.1323 7.26768 16.0771 9.70249Z"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <!-- Remember Me -->
            <div>
              <label
                for="keepLoggedIn"
                class="flex items-center text-sm font-normal text-white/80 cursor-pointer select-none"
              >
                <div class="relative">
                  <input v-model="keepLoggedIn" type="checkbox" id="keepLoggedIn" class="sr-only" />
                  <div
                    :class="
                      keepLoggedIn ? 'border-blue-400 bg-blue-500' : 'bg-white/10 border-white/30'
                    "
                    class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border transition-colors"
                  >
                    <span :class="keepLoggedIn ? '' : 'opacity-0'">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                          stroke="white"
                          stroke-width="1.94437"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                Ingat saya
              </label>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
            >
              Masuk
            </button>
          </div>
        </form>

        <!-- Sign Up Link -->
        <div class="mt-6 text-center">
          <p class="text-sm font-normal text-white/70">
            Belum punya akun?
            <router-link to="/signup" class="text-blue-400 hover:text-blue-300 font-medium"
              >Daftar sekarang</router-link
            >
          </p>
        </div>
      </div>
    </div>

    <!-- Right Illustration Section (visible on large screens) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background pattern/grid -->
      <div class="absolute inset-0 bg-indigo-900/50 backdrop-blur-sm z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <!-- Circles decoration -->
      <div
        class="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl"
      ></div>
      <div
        class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full filter blur-3xl"
      ></div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center justify-center h-full p-12">
        <div class="flex flex-col items-center max-w-md text-center">
          <!-- Logo - menggunakan SVG langsung daripada image path -->
          <div class="mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="180"
              height="60"
              viewBox="0 0 180 60"
              fill="none"
            >
              <path d="M30 15h120v30H30z" fill="none" />
              <text
                x="37"
                y="38"
                font-family="Arial, sans-serif"
                font-size="24"
                font-weight="bold"
                fill="white"
              >
                ERP KJP
              </text>
              <circle cx="20" cy="30" r="15" fill="#4F46E5" />
              <path
                d="M15 30l5 5 10-10"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-white mb-4">Aplikasi Manajemen Terbaik</h2>
          <p class="text-white/80 text-lg">
            Platform manajemen yang dibuat khusus untuk kebutuhan bisnis Anda. Kelola proyek, tim,
            dan produktivitas dalam satu tempat.
          </p>

          <!-- Testimonial -->
          <div class="mt-16 bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-white"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <p class="text-white/90 italic mb-4">
                "Aplikasi ini mengubah cara tim kami bekerja. Efisiensi meningkat 35% dalam 2 bulan
                pertama!"
              </p>
              <p class="text-white font-medium">Budi Santoso</p>
              <p class="text-white/60 text-sm">CEO, PT Maju Bersama</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStores'
import { defineComponent } from 'vue'
import router from '@/router'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'sign-in',
  components: {},
  data() {
    const authStore = useAuthStore()
    const router = useRouter()
    return {
      showPassword: false,
      keepLoggedIn: false,
      email: '',
      password: '',

      //import
      authStore,
      router,
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    async handleSubmit() {
      await this.authStore.login(this.email, this.password)
    },
  },
})
</script>
