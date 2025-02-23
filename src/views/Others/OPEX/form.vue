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
            <h1 class="text-2xl font-bold text-gray-800">Create New Account Receivable</h1>
            <p class="text-gray-500 text-sm mt-1">Finance / Account Receivable / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/account-receivable"
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
          <!-- Customer Name -->
          <FormGroup
            label="Customer Name"
            :required="true"
            :error="rules.customerName"
            errorMessage="Customer name is required"
          >
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              v-model="customerName"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.customerName
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter customer name"
              autofocus
            />
          </FormGroup>

          <!-- Invoice Number -->
          <FormGroup
            label="Invoice Number"
            :required="true"
            :error="rules.invoiceNumber"
            errorMessage="Invoice number is required"
          >
            <input
              type="text"
              id="invoice_number"
              name="invoice_number"
              v-model="invoiceNumber"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.invoiceNumber
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter invoice number"
            />
          </FormGroup>

          <!-- Amount -->
          <FormGroup
            label="Amount"
            :required="true"
            :error="rules.amount"
            errorMessage="Amount is required and must be greater than 0"
          >
            <input
              type="number"
              id="amount"
              name="amount"
              v-model="amount"
              min="0"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.amount
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter amount"
            />
          </FormGroup>

          <!-- Due Date -->
          <FormGroup
            label="Due Date"
            :required="true"
            :error="rules.dueDate"
            errorMessage="Due date is required and must be in the future"
          >
            <input
              type="date"
              id="due_date"
              name="due_date"
              v-model="dueDate"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.dueDate
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              :min="new Date().toISOString().split('T')[0]"
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
  name: 'AccountReceivableForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
  },

  data() {
    return {
      customerName: '',
      invoiceNumber: '',
      amount: null,
      dueDate: '',
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
      if (this.isSubmitting) return

      const isValid = this.validation()

      if (!isValid) {
        this.showNotification('error', 'Please fill in all required fields correctly')
        return
      }

      this.isSubmitting = true

      try {
        const accountReceivableData = {
          customerName: this.customerName,
          invoiceNumber: this.invoiceNumber,
          amount: this.amount,
          dueDate: this.dueDate,
        }

        console.log('Submitting account receivable data:', accountReceivableData)
        // Add your API call here

        this.showNotification('success', 'Account receivable created successfully')
        setTimeout(() => {
          this.$router.push('/account-receivable')
        }, 1500)
      } catch (error) {
        console.error('Error creating account receivable:', error)
        this.showNotification('error', 'Failed to create account receivable. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
  },
})
</script>
