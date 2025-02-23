<template>
  <AdminLayout>
    <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
      <!-- Notification -->
      <div
        v-if="notification.show"
        :class="[
          notification.type === 'success'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700',
        ]"
        class="mb-4 p-4 rounded-lg shadow-sm"
      >
        {{ notification.message }}
      </div>

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="flex justify-between items-center p-6 border-b">
          <div class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Create New Bank Account</h1>
            <p class="text-gray-500 text-sm mt-1">Master Data / Bank Account / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/bank-account"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </RouterLink>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Bank Name -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bank_name"
              name="bank_name"
              v-model="bankName"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.bankName
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter bank name"
            />
            <p v-if="rules.bankName" class="mt-2 text-sm text-red-600">Bank name is required</p>
          </div>

          <!-- Account Number -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Account Number
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="account_number"
              name="account_number"
              v-model="accountNumber"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.accountNumber
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter account number"
            />
            <p v-if="rules.accountNumber" class="mt-2 text-sm text-red-600">
              Account number is required
            </p>
          </div>

          <!-- Account Holder -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Account Holder
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="account_holder"
              name="account_holder"
              v-model="accountHolder"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.accountHolder
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter account holder name"
            />
            <p v-if="rules.accountHolder" class="mt-2 text-sm text-red-600">
              Account holder name is required
            </p>
          </div>

          <!-- Branch -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Branch
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              v-model="branch"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.branch
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter branch"
            />
            <p v-if="rules.branch" class="mt-2 text-sm text-red-600">Branch is required</p>
          </div>
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

export default defineComponent({
  name: 'BankAccountForm',
  components: {
    AdminLayout,
    Form,
    RouterLink,
  },

  data() {
    return {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branch: '',
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        bankName: false,
        accountNumber: false,
        accountHolder: false,
        branch: false,
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

      // Validate bank name
      if (!this.bankName?.trim()) {
        this.rules.bankName = true
        isValid = false
      }

      // Validate account number
      if (!this.accountNumber?.trim()) {
        this.rules.accountNumber = true
        isValid = false
      }

      // Validate account holder
      if (!this.accountHolder?.trim()) {
        this.rules.accountHolder = true
        isValid = false
      }

      // Validate branch
      if (!this.branch?.trim()) {
        this.rules.branch = true
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
        const bankAccountData = {
          bankName: this.bankName,
          accountNumber: this.accountNumber,
          accountHolder: this.accountHolder,
          branch: this.branch,
        }

        console.log('Submitting bank account data:', bankAccountData)
        // Add your API call here

        this.showNotification('success', 'Bank account created successfully')
        setTimeout(() => {
          this.$router.push('/bank-account')
        }, 1500)
      } catch (error) {
        console.error('Error creating bank account:', error)
        this.showNotification('error', 'Failed to create bank account. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
  },
})
</script>
