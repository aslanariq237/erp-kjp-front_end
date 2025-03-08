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
            <h1 class="text-2xl font-bold text-gray-800">Create New Opex</h1>
            <p class="text-gray-500 text-sm mt-1">Finance / Opex / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/opex"
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
          <!-- Customer Name -->
          <FormGroup
            label="Opex"
            :required="true"
            :error="rules.customerName"
            errorMessage="Opex is required"
          >
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              v-model="opex_name"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.customerName
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter opex name"
              autofocus
            />
          </FormGroup> 
          <FormGroup
            label="Customer"
            :required="false"
            :error="rules.customerName"
            errorMessage="Opex is required"
          >
            <input
              type="text"
              id="customer_name"
              name="customer_name"              
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.customerName
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter opex name"
              autofocus
            />
          </FormGroup>          

          <!-- Amount -->
          <FormGroup
            label="Price"
            :required="true"
            :error="rules.amount"
            errorMessage="Amount is required and must be greater than 0"
          >
            <input
              type="number"
              id="amount"
              name="amount"
              v-model="opex_price"
              min="0"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.amount
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter price"
            />
          </FormGroup>

          <FormGroup
            label="Price"
            :required="true"
            :error="rules.amount"
            errorMessage="Amount is required and must be greater than 0"
          >
            <select name="opex_type" id="opex_type" v-model="opex_type"
            :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.amount
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="">-- select opex type --</option>
              <option value="internal">Internal</option>
              <option value="eksternal">Eksternal</option>
              <option value="cogs">COGS</option>
            </select>
          </FormGroup>

          <!-- Due Date -->          
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
import { AddOpex } from '@/core/utils/url_api'
import router from '@/router'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'AccountReceivableForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
  },

  data() {
    return {                  
      opex_name : '',
      opex_price: 0,
      opex_type: '',
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        customerName: false,
        invoiceNumber: false,
        amount: false,
        dueDate: false,
      },
    }
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

    validation() {
      let isValid = true

      // Reset all rules first
      Object.keys(this.rules).forEach((key) => {
        this.rules[key] = false
      })

      // Validate customer name
      if (!this.customerName?.trim()) {
        this.rules.customerName = true
        isValid = false
      }

      // Validate invoice number
      if (!this.invoiceNumber?.trim()) {
        this.rules.invoiceNumber = true
        isValid = false
      }

      // Validate amount
      if (!this.amount || this.amount < 0) {
        this.rules.amount = true
        isValid = false
      }

      // Validate due date
      if (!this.dueDate?.trim() || new Date(this.dueDate) < new Date()) {
        this.rules.dueDate = true
        isValid = false
      }

      return isValid
    },

    async onSubmit() {
      await axios.post(AddOpex, {
        opex_name : this.opex_name,
        opex_price: this.opex_price,
        opex_type : this.opex_type,
      }).then((response) => {
          console.log(response)
          Swal.fire({
            icon: "success",
            title: 'Success',
            text: "Data has been Saved"
          }).then(async (result) => {
            if (result.isConfirmed) {
              var mssg = "";
              if (this.id != null) {
                mssg = "Success Update Opex";
              } else {
                mssg = "Success Create Opex";
              }
              await router.push("/opex");
              this.alertStore.success(mssg);
            }
          })
        }, (error) => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              (error.response &&
                error.response &&
                error.response.message) ||
              error.message ||
              error.toString(),
          });
        },
        )
    },
  },
})
</script>
