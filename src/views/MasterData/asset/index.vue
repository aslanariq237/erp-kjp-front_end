<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Asset Management</h1>
          <p class="text-gray-500 text-sm mt-1">Master Data / Assets</p>
        </div>
        <RouterLink to="/asset/form"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
          Add New Asset
        </RouterLink>
      </div>

      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="text-sm text-gray-600 mb-1 block">Search</label>
            <input type="text" v-model="searchQuery" placeholder="Search customers..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div class="form-group">
            <label class="text-sm text-gray-600 mb-1 block">Sort By</label>
            <select v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="id">ID</option>
            </select>
          </div>
          <div class="form-group">
            <label class="text-sm text-gray-600 mb-1 block">Items per page</label>
            <select v-model="itemsPerPage"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendor Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Umur Assets
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Book Value
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(customer, index) in paginatedData" :key="customer.id_customer" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.code }}
              </td>              
              <td class="px-6 py-4 whitespace-nowrap text-sm text-black font-semibold">
                {{ customer.assets_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.vendor.vendor_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(customer.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.issue_at }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.assets_life }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ customer.assets_life }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="editData(customer.asset_id)" class="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button @click="currentPage++" :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ startIndex + 1 }}</span>
                to
                <span class="font-medium">{{ endIndex }}</span>
                of
                <span class="font-medium">{{ filteredData.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button @click="currentPage--" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                  currentPage === page
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                ]">
                  {{ page }}
                </button>
                <button @click="currentPage++" :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import axios from 'axios'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { RouterLink } from 'vue-router'
import { Asset } from '@/core/utils/url_api'
import router from '@/router'

export default defineComponent({
  name: 'CustomerPage',
  components: {
    AdminLayout,
  },

  setup() {
    // Data
    const customers = ref([])

    // Fetch customers from API
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(Asset)
        customers.value = response.data
      } catch (error) {
        console.error('Error fetching customers:', error)
      }
    }

    onMounted(() => {
      fetchCustomers()
    })

    // Filtering and Sorting
    const searchQuery = ref('')
    const sortBy = ref('name')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const filteredData = computed(() => {
      let result = [...customers.value]

      // Search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (customer) =>
            customer.customer_name.toLowerCase().includes(query) ||
            customer.customer_email.toLowerCase().includes(query) ||
            customer.customer_phone.includes(query),
        )
      }

      // Sort
      result.sort((a, b) => {
        const fieldA = a[sortBy.value]?.toString().toLowerCase() || ''
        const fieldB = b[sortBy.value]?.toString().toLowerCase() || ''
        return fieldA.localeCompare(fieldB)
      })

      return result
    })

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    }

    // Pagination
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

    const endIndex = computed(() =>
      Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length),
    )

    const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

    // Utility functions
    const getAvatarUrl = (name) => {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    }

    const editData = (id) => {
      router.push('/asset/edit/' + id);
    }

    const deleteCustomer = (customer) => {
      if (confirm('Are you sure you want to delete this customer?')) {
        console.log('Delete customer:', customer)
        // Implement delete logic
      }
    }

    return {
      searchQuery,
      sortBy,
      currentPage,
      itemsPerPage,
      filteredData,
      paginatedData,
      totalPages,
      startIndex,
      endIndex,
      getAvatarUrl,
      editData,
      deleteCustomer,
      formatCurrency,
      customers, // <--- Tambahkan ini
    }
  },
})
</script>