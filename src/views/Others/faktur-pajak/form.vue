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
          <div class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Create New Faktur Pajak</h1>
            <p class="text-gray-500 text-sm mt-1">Finance / Faktur Pajak / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/faktur-pajak"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
            >
              <i class="fas fa-times"></i>
              Cancel
            </RouterLink>
            <button
              type="submit"
              :disabled="isSubmitting"
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
          <!-- Invoice ID -->
          <FormGroup
            label="Invoice ID"
            :required="true"
            :error="rules.id_invoice"
            errorMessage="Invoice ID is required"
          >
            <input
              type="text"
              id="id_invoice"
              name="id_invoice"
              v-model="id_invoice"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.id_invoice
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter invoice ID"
            />
          </FormGroup>

          <!-- Customer ID -->
          <FormGroup
            label="Customer"
            :required="true"
            :error="rules.customer_id"
            errorMessage="Customer is Required"
          >
            <input
              type="text"
              name="customer_name"
              id="customer_name"
              v-model="customer_name"
              @input="filterCustomers"
              class="rounded w-full"
              placeholder="Type customer name"
            />
            <ul v-if="filteredCustomers.length" class="border rounded w-full mt-2 bg-white">
              <li
                v-for="customer in filteredCustomers"
                :key="customer.customer_id"
                @click="selectCustomer(customer)"
                class="p-2 cursor-pointer hover:bg-gray-200"
              >
                {{ customer.customer_name }}
              </li>
            </ul>
          </FormGroup>

          <!-- Faktur Pajak Code -->
          <FormGroup
            label="Faktur Pajak Code"
            :required="true"
            :error="rules.code_faktur_pajak"
            errorMessage="Faktur Pajak Code is required"
          >
            <input
              type="text"
              id="code_faktur_pajak"
              name="code_faktur_pajak"
              v-model="code_faktur_pajak"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.code_faktur_pajak
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter Faktur Pajak code"
            />
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
import { Customer, Invoice, AddFakturPajak } from '@/core/utils/url_api'

export default defineComponent({
  name: 'FakturPajakForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
    RouterLink,
  },

  data() {
    return {
      customers: [],
      invoices: [],
      filteredCustomers: [],
      filteredInvoices: [],
      id_invoice: '',
      customer_name: '',
      code_faktur_pajak: '',
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        id_invoice: false,
        id_customer: false,
        code_faktur_pajak: false,
      },
    }
  },
  async mounted() {
    this.getCustomer()
    this.getInvoice()
  },
  methods: {
    showNotification(type, message) {
      this.notification = {
        show: true,
        type,
        message,
      }

      // Hide notification after 3 seconds
      setTimeout(() => {
        this.notification.show = false
      }, 3000)
    },

    getCustomer() {
      axios
        .get(Customer)
        .then((response) => {
          this.customers = response.data
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    },
    getInvoice() {
      axios
        .get(Invoice)
        .then((response) => {
          this.invoices = response.data
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    },
    filterCustomers() {
      const searchTerm = this.customer_name.toLowerCase()
      this.filteredCustomers = this.customers.filter((customer) => {
        const name = customer.customer_name.toLowerCase()
        return name.includes(searchTerm)
      })
    },
    selectCustomer(customer) {
      this.customer_id = customer.customer_id
      this.customer_name = customer.customer_name
      this.filteredCustomers = []
    },
    filterInvoices() {
      const searchTerm = this.id_invoice.toLowerCase()
      this.filteredInvoices = this.invoices.filter((invoice) => {
        const id = invoice.id_invoice.toLowerCase()
        return id.includes(searchTerm)
      })
    },
    selectInvoice(invoice) {
      this.id_invoice = invoice.id_invoice
      this.filteredInvoices = []
    },
    validation() {
      let isValid = true

      // Reset all rules first
      Object.keys(this.rules).forEach((key) => {
        this.rules[key] = false
      })

      // Validate invoice ID
      if (!this.id_invoice?.trim()) {
        this.rules.id_invoice = true
        isValid = false
      }

      // Validate customer ID
      if (!this.id_customer?.trim()) {
        this.rules.id_customer = true
        isValid = false
      }

      // Validate Faktur Pajak code
      if (!this.code_faktur_pajak?.trim()) {
        this.rules.code_faktur_pajak = true
        isValid = false
      }

      return isValid
    },

    async onSubmit() {
      const result = 2
      if (result != 0) {
        await axios
          .post(AddFakturPajak, {
            id_invoice: this.id_invoice,
            id_customer: this.id_customer,
            code_faktur_pajak: this.code_faktur_pajak,
          })
          .then(
            (response) => {
              console.log(response)
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data has been Saved',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  var mssg = ''
                  if (this.id != null) {
                    mssg = 'Success Update Faktur Pajak'
                  } else {
                    mssg = 'Success Create Faktur Pajak'
                  }
                  await this.$router.push('/faktur-pajak')
                  this.showNotification('success', mssg)
                }
              })
            },
            (error) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text:
                  (error.response && error.response && error.response.message) ||
                  error.message ||
                  error.toString(),
              })
            },
          )
      }
    },

    inputClass(error) {
      return [
        'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
        error
          ? 'border-red-300 focus:ring-red-500 bg-red-50'
          : 'border-gray-300 focus:ring-blue-500',
      ]
    },
  },
})
</script>
