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
            <h1 class="text-2xl font-bold text-gray-800">Create New Delivery Order</h1>
            <p class="text-gray-500 text-sm mt-1">Others / Delivery Order / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/delivery-order"
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
          <!-- No -->
          <FormGroup label="No" :required="true" :error="rules.no" errorMessage="No is required">
            <input
              type="text"
              id="no"
              name="no"
              v-model="form.no"
              :class="inputClass(rules.no)"
              placeholder="Enter No"
              autofocus
            />
          </FormGroup>

          <!-- Code DO -->
          <FormGroup
            label="Code DO"
            :required="true"
            :error="rules.code_do"
            errorMessage="Code DO is required"
          >
            <input
              type="text"
              id="code_do"
              name="code_do"
              v-model="form.code_do"
              :class="inputClass(rules.code_do)"
              placeholder="Enter Code DO"
            />
          </FormGroup>

          <!-- DO Type -->
          <FormGroup
            label="DO Type"
            :required="true"
            :error="rules.do_type"
            errorMessage="DO Type is required"
          >
            <input
              type="text"
              id="do_type"
              name="do_type"
              v-model="form.do_type"
              :class="inputClass(rules.do_type)"
              placeholder="Enter DO Type"
            />
          </FormGroup>

          <!-- Status Payment -->
          <FormGroup
            label="Status Payment"
            :required="true"
            :error="rules.status_payment"
            errorMessage="Status Payment is required"
          >
            <input
              type="text"
              id="status_payment"
              name="status_payment"
              v-model="form.status_payment"
              :class="inputClass(rules.status_payment)"
              placeholder="Enter Status Payment"
            />
          </FormGroup>

          <!-- Sub Total -->
          <FormGroup
            label="Sub Total"
            :required="true"
            :error="rules.sub_total"
            errorMessage="Sub Total is required"
          >
            <input
              type="number"
              id="sub_total"
              name="sub_total"
              v-model="form.sub_total"
              :class="inputClass(rules.sub_total)"
              placeholder="Enter Sub Total"
            />
          </FormGroup>

          <!-- Total Tax -->
          <FormGroup
            label="Total Tax"
            :required="true"
            :error="rules.total_tax"
            errorMessage="Total Tax is required"
          >
            <input
              type="number"
              id="total_tax"
              name="total_tax"
              v-model="form.total_tax"
              :class="inputClass(rules.total_tax)"
              placeholder="Enter Total Tax"
            />
          </FormGroup>

          <!-- Total Service -->
          <FormGroup
            label="Total Service"
            :required="true"
            :error="rules.total_service"
            errorMessage="Total Service is required"
          >
            <input
              type="number"
              id="total_service"
              name="total_service"
              v-model="form.total_service"
              :class="inputClass(rules.total_service)"
              placeholder="Enter Total Service"
            />
          </FormGroup>

          <!-- Deposit -->
          <FormGroup
            label="Deposit"
            :required="true"
            :error="rules.deposit"
            errorMessage="Deposit is required"
          >
            <input
              type="number"
              id="deposit"
              name="deposit"
              v-model="form.deposit"
              :class="inputClass(rules.deposit)"
              placeholder="Enter Deposit"
            />
          </FormGroup>

          <!-- PPN -->
          <FormGroup label="PPN" :required="true" :error="rules.ppn" errorMessage="PPN is required">
            <input
              type="number"
              id="ppn"
              name="ppn"
              v-model="form.ppn"
              :class="inputClass(rules.ppn)"
              placeholder="Enter PPN"
            />
          </FormGroup>

          <!-- Grand Total -->
          <FormGroup
            label="Grand Total"
            :required="true"
            :error="rules.grand_total"
            errorMessage="Grand Total is required"
          >
            <input
              type="number"
              id="grand_total"
              name="grand_total"
              v-model="form.grand_total"
              :class="inputClass(rules.grand_total)"
              placeholder="Enter Grand Total"
            />
          </FormGroup>

          <!-- Issue Date -->
          <FormGroup
            label="Issue Date"
            :required="true"
            :error="rules.issue_at"
            errorMessage="Issue Date is required"
          >
            <input
              type="date"
              id="issue_at"
              name="issue_at"
              v-model="form.issue_at"
              :class="inputClass(rules.issue_at)"
            />
          </FormGroup>

          <!-- Due Date -->
          <FormGroup
            label="Due Date"
            :required="true"
            :error="rules.due_at"
            errorMessage="Due Date is required"
          >
            <input
              type="date"
              id="due_at"
              name="due_at"
              v-model="form.due_at"
              :class="inputClass(rules.due_at)"
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

export default defineComponent({
  name: 'DeliveryOrderForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
  },

  data() {
    return {
      form: {
        no: '',
        code_do: '',
        do_type: '',
        status_payment: '',
        sub_total: '',
        total_tax: '',
        total_service: '',
        deposit: '',
        ppn: '',
        grand_total: '',
        issue_at: '',
        due_at: '',
      },
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        no: false,
        code_do: false,
        do_type: false,
        status_payment: false,
        sub_total: false,
        total_tax: false,
        total_service: false,
        deposit: false,
        ppn: false,
        grand_total: false,
        issue_at: false,
        due_at: false,
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

      // Validate fields
      Object.keys(this.form).forEach((key) => {
        if (!this.form[key]?.toString().trim()) {
          this.rules[key] = true
          isValid = false
        }
      })

      return isValid
    },

    async onSubmit() {
      if (this.isSubmitting) return

      const isValid = this.validation()

      if (!isValid) {
        this.showNotification('error', 'Please fill in all required fields correctly')
        return
      }

      this.isSubmitting = true

      try {
        const deliveryOrderData = { ...this.form }

        console.log('Submitting delivery order data:', deliveryOrderData)
        // Add your API call here

        this.showNotification('success', 'Delivery order created successfully')
        setTimeout(() => {
          this.$router.push('/delivery-order')
        }, 1500)
      } catch (error) {
        console.error('Error creating delivery order:', error)
        this.showNotification('error', 'Failed to create delivery order. Please try again.')
      } finally {
        this.isSubmitting = false
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
