<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto">
      <form @submit.prevent="onSubmit">
        <!-- Header Card -->
        <div class="bg-white shadow-lg rounded-lg p-4 mb-4">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-xl font-semibold">Form Product</h1>
              <p class="text-gray-400">Master Data / Product / Form</p>
            </div>
            <div class="flex gap-4">
              <RouterLink
                to="/product"
                class="px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </RouterLink>
              <button
                type="submit"
                class="px-5 py-2 bg-green-500 hover:bg-green-600 rounded-md text-white transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="bg-white shadow-lg rounded-lg p-6">
          <!-- Image and Name Row -->
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Product Image</label>
              <div class="flex items-center space-x-4">
                <div
                  class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    class="w-full h-full object-cover"
                    alt="Product preview"
                  />
                  <span v-else class="text-gray-400">No image</span>
                </div>
                <div class="flex-1">
                  <input
                    type="file"
                    ref="fileInput"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    @change="handleFileUpload"
                    accept="image/*"
                  />
                  <p v-if="rules.product_image" class="mt-1 text-sm text-red-600">
                    Product image is required
                  </p>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                v-model="product_name"
                type="text"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                :class="{ 'border-red-500': rules.product_name }"
                placeholder="Enter product name"
              />
              <p v-if="rules.product_name" class="text-sm text-red-600">Product name is required</p>
            </div>
          </div>

          <!-- Weight and Stock Row -->
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Product Weight</label>
              <input
                v-model="product_weight"
                type="number"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                :class="{ 'border-red-500': rules.product_weight }"
                placeholder="Enter product weight"
              />
              <p v-if="rules.product_weight" class="text-sm text-red-600">
                Product weight is required
              </p>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Stock</label>
              <input
                v-model="stock"
                type="number"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                :class="{ 'border-red-500': rules.stock }"
                placeholder="Enter stock quantity"
              />
              <p v-if="rules.stock" class="text-sm text-red-600">Stock is required</p>
            </div>
          </div>

          <!-- Status Row -->
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <select
                v-model="status"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                :class="{ 'border-red-500': rules.status }"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <p v-if="rules.status" class="text-sm text-red-600">Status is required</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { RouterLink } from 'vue-router'

export default {
  name: 'ProductForm',

  components: {
    AdminLayout,
    RouterLink,
  },

  data() {
    return {
      id_product: '',
      product_image: null,
      imagePreview: null,
      product_name: '',
      product_weight: null,
      stock: null,
      status: '',
      rules: {
        product_image: false,
        product_name: false,
        product_weight: false,
        stock: false,
        status: false,
      },
    }
  },

  methods: {
    validation() {
      let isValid = true

      // Reset all rules first
      Object.keys(this.rules).forEach((key) => {
        this.rules[key] = false
      })

      // Validate product image
      if (!this.product_image) {
        this.rules.product_image = true
        isValid = false
      }

      // Validate product name
      if (!this.product_name?.trim()) {
        this.rules.product_name = true
        isValid = false
      }

      // Validate product weight
      if (!this.product_weight || this.product_weight <= 0) {
        this.rules.product_weight = true
        isValid = false
      }

      // Validate stock
      if (!this.stock || this.stock < 0) {
        this.rules.stock = true
        isValid = false
      }

      // Validate status
      if (!this.status) {
        this.rules.status = true
        isValid = false
      }

      return isValid
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      this.product_image = file

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
      }
      reader.readAsDataURL(file)
    },

    async onSubmit() {
      if (!this.validation()) {
        return
      }

      // Create FormData for the API request
      const formData = new FormData()
      formData.append('product_image', this.product_image)
      formData.append('product_name', this.product_name)
      formData.append('product_weight', this.product_weight)
      formData.append('stock', this.stock)
      formData.append('status', this.status)

      try {
        // TODO: Replace with your API endpoint
        // const response = await axios.post('/api/products', formData)
        console.log('Form data ready for submission:', formData)

        // Redirect on success
        this.$router.push('/product')
      } catch (error) {
        console.error('Error submitting form:', error)
        // Handle error appropriately
      }
    },
  },
}
</script>
