<template>
  <AdminLayout>
    <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
      <!-- Notification -->
      <div
        v-if="notification.show"
        :class="[
          'mb-4 p-4 rounded-lg shadow-sm',
          notification.type === 'success'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700',
        ]"
      >
        {{ notification.message }}
      </div>

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="flex justify-between items-center p-6 border-b">
          <div class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Create New Asset</h1>
            <p class="text-gray-500 text-sm mt-1">Master Data / Asset / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/asset"
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
          <!-- Asset Name -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Asset Name
              <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name_asset"
              name="name_asset"
              v-model="name"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.name
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter asset name"
            />
            <p v-if="rules.name" class="mt-2 text-sm text-red-600">Asset name is required</p>
          </div>

          <!-- Asset Type -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Asset Type
              <span class="text-red-500">*</span>
            </label>
            <select
              id="asset_type"
              name="asset_type"
              v-model="id_asset_type"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.asset_type
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="">Select asset type</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="furniture">Furniture</option>
              <option value="vehicle">Vehicle</option>
            </select>
            <p v-if="rules.asset_type" class="mt-2 text-sm text-red-600">Asset type is required</p>
          </div>

          <!-- Quantity -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Quantity
              <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity_asset"
              name="quantity_asset"
              v-model="qty"
              min="1"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.qty
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter quantity"
            />
            <p v-if="rules.qty" class="mt-2 text-sm text-red-600">Quantity is required</p>
          </div>

          <!-- Status -->
          <div class="form-group">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status
              <span class="text-red-500">*</span>
            </label>
            <select
              id="status_asset"
              name="status_asset"
              v-model="status"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.status
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="">Select status</option>
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
            <p v-if="rules.status" class="mt-2 text-sm text-red-600">Status is required</p>
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
  name: 'AssetForm',
  components: {
    AdminLayout,
    Form,
  },

  data() {
    return {
      id_asset_type: '',
      name: '',
      qty: null,
      status: '',
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        asset_type: false,
        name: false,
        qty: false,
        status: false,
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

      // Validate name
      if (!this.name?.trim()) {
        this.rules.name = true
        isValid = false
      }

      // Validate asset type
      if (!this.id_asset_type?.trim()) {
        this.rules.asset_type = true
        isValid = false
      }

      // Validate quantity
      if (!this.qty || this.qty < 1) {
        this.rules.qty = true
        isValid = false
      }

      // Validate status
      if (!this.status?.trim()) {
        this.rules.status = true
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
        const assetData = {
          id_asset_type: this.id_asset_type,
          name: this.name,
          qty: this.qty,
          status: this.status,
        }

        console.log('Submitting asset data:', assetData)
        // Add your API call here

        this.showNotification('success', 'Asset created successfully')
        setTimeout(() => {
          this.$router.push('/asset')
        }, 1500)
      } catch (error) {
        console.error('Error creating asset:', error)
        this.showNotification('error', 'Failed to create asset. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
  },
})
</script>
