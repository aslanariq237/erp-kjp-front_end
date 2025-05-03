<template>
  <AdminLayout>
    <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
      <!-- Notification -->
      <Notification
        v-if="notification.show"
        :type="notification.type"
        :message="notification.message"
        @close="notification.show = false"
      />

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="flex justify-between items-center p-6 border-b">
          <div v-if="id" class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Edit Opex Absorb</h1>
            <p class="text-gray-500 text-sm mt-1">Finance / Opex / Form</p>
          </div>
          <div v-else class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Create New Opex Absorb</h1>
            <p class="text-gray-500 text-sm mt-1">Finance / Opex / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/opex-absorb"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
            >
              <i class="fas fa-times"></i>
              Cancel
            </RouterLink>
            <button
              type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Opex Name -->
          <FormGroup
            label="Opex Name"
            :required="true"
            :error="rules.opex_name"
            errorMessage="Opex Name is required"
          >
            <input
              type="text"
              id="name"
              name="name"
              v-model="opex_name"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.opex_name
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter Opex Name"
            />
            <div v-if="rules.opex_name">
              <p class="text-red-500 text-sm">Opex Name is required</p>
            </div>
          </FormGroup>

          <!-- Price -->
          <FormGroup
            label="Price"
            :required="true"
            :error="rules.opex_price"
            errorMessage="Price is required and must be greater than 0"
          >
            <input
              type="number"
              id="amount"
              name="amount"
              v-model="opex_price"
              min="0"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.opex_price
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter Price"
            />
            <div v-if="rules.opex_price">
              <p class="text-red-500 text-sm">Price is required</p>
            </div>
          </FormGroup>

          <!-- Opex Type -->
          <FormGroup
            label="Opex Type"
            :required="true"
            :error="rules.opex_type"
            errorMessage="Opex Type is required"
          >
            <select
              name="opex_type"
              id="opex_type"
              v-model="opex_type"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.opex_type
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="absorb">Absorb</option>
            </select>
          </FormGroup>

          <!-- Customer -->
          <FormGroup
            v-if="opex_type !== 'internal'"
            label="Customer"
            class="relative"
            :required="true"
            :error="rules.customer_id"
            errorMessage="Customer is required"
          >
            <input
              type="text"
              autocomplete="off"
              name="customer_name"
              id="customer_name"
              v-model="customer_name"
              @input="filterCustomers"
              class="rounded w-full"
              placeholder="Type customer name"
            />
            <ul
              v-if="filteredCustomers.length"
              class="border rounded w-full mt-2 absolute z-40 bg-white"
            >
              <li
                v-for="customer in filteredCustomers"
                :key="customer.customer_id"
                @click="selectCustomer(customer)"
                class="p-2 cursor-pointer hover:bg-gray-200"
              >
                {{ customer.customer_name }}
              </li>
              <li v-if="filteredCustomers.length === 0">Not found</li>
            </ul>
          </FormGroup>
        </div>
      </div>
    </Form>
  </AdminLayout>
</template>

<script>
import { defineComponent } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Form } from 'vee-validate'
import { RouterLink } from 'vue-router'
import Notification from '@/components/Notification.vue'
import FormGroup from '@/components/FormGroup.vue'
import axios from 'axios'
import { AddOpex, Customer, GetOpex } from '@/core/utils/url_api'
import router from '@/router'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'OpexAbsorbForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
  },

  data() {
    return {
      opex_name: '',
      opex_price: 0,
      opex_type: '',
      customers: [],
      customer_name: '',
      filteredCustomers: [],
      customer_id: null,
      isSubmitting: false,
      id: null,
      rules: {
        opex_name: false,
        opex_price: false,
        opex_type: false,
        customer_id: false,
      },
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
    }
  },
  async mounted() {
    this.getCustomer()
    console.log('ID Param', this.$route.params.id)
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      await this.getById(this.id)
    }
  },

  methods: {
    getCustomer() {
      axios.get(Customer).then((res) => {
        this.customers = res.data
      })
    },
    filterCustomers() {
      const searchTerm = this.customer_name.toLowerCase()
      this.filteredCustomers = this.customers.filter((customer) =>
        customer.customer_name.toLowerCase().includes(searchTerm),
      )
    },
    selectCustomer(customer) {
      this.customer_id = customer.customer_id
      this.customer_name = customer.customer_name
      this.filteredCustomers = []
    },
    showNotification(type, message) {
      this.notification = { show: true, type, message }
      setTimeout(() => (this.notification.show = false), 3000)
    },
    async validation() {
      let count = 0

      this.rules.opex_name = !this.opex_name
      this.rules.opex_price = !this.opex_price || this.opex_price <= 0
      this.rules.opex_type = !this.opex_type
      this.rules.customer_id = this.opex_type !== 'internal' && !this.customer_id

      count += Object.values(this.rules).filter((rule) => rule).length
      return count
    },
    async getById(id) {
      await axios.get(GetOpex + '/' + id).then((res) => {
        var data = res.data
        this.opex_name = data.opex_name
        this.opex_price = data.opex_price
        this.opex_type = data.opex_type
        this.customer_id = data.customer_id
        this.customer_name = data.customer.customer_name
        this.issue_at = data.issue_at
        this.due_at = data.due_at
        this.termin = data.termin
        // this.vendor_id = data.vendor_id
        // this.vendor_name = data.vendor.vendor_name
        this.deposit = data.deposit
        console.log('Data', data)
        if (data.id_po) {
          this.getDetailSo(data.id_po)
        }
      })
    },
    async onSubmit() {
      const result = await this.validation()
      if (result === 0) {
        this.isSubmitting = true
        axios
          .post(AddOpex, {
            customer_id: this.customer_id,
            opex_name: this.opex_name,
            opex_price: this.opex_price,
            opex_type: this.opex_type,
          })
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data has been saved',
            }).then(() => router.push('/opex-absorb'))
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response?.data?.message || error.message,
            })
          })
          .finally(() => {
            this.isSubmitting = false
          })
      }
    },
  },
})
</script>
