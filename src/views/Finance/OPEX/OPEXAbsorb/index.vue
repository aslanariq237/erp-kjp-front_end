<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">OPEX Absorb</h1>
          <p class="text-gray-500 text-sm mt-1">Finance Tools / Opex Absorb</p>
        </div>
        <div class="flex gap-3">
          <button @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            <span>Export</span>
          </button>
          <RouterLink to="/opex-absorb/form"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Add New OPEX
          </RouterLink>
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search by name or code..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Price Range</label>
            <div class="flex gap-2">
              <input type="number" v-model="minPrice" placeholder="Min"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" v-model="maxPrice" placeholder="Max"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Sort By</label>
            <select v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="opex_name">Name</option>
              <option value="opex_price">Price</option>
              <option value="opex_code">Code</option>
              <option value="opex_type">Type</option>
            </select>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Items per page</label>
            <select v-model="itemsPerPage"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Enhanced Table Section -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th v-for="header in tableHeaders" :key="header.key"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy = header.key">
                  <div class="flex items-center gap-2">
                    {{ header.label }}
                    <span v-if="sortBy === header.key">↓</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="text-center">
                <td colspan="5" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center">
                <td colspan="5" class="px-6 py-4">No data found</td>
              </tr>
              <tr v-for="(opex, index) in paginatedData" :key="opex.opex_id"
                class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ opex.opex_code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ opex.opex_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ opex.customer ? opex.customer.customer_name : 'None Customer' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(opex.opex_price) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ opex.opex_type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <button v-if="opex.approved == 0" class="text-green-600 hover:text-green-900"
                      @click="approve(opex.opex_id)">
                      Approve
                    </button>
                    <button class="text-blue-600 hover:text-green-900" @click="editData(opex.opex_id)">
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Enhanced Pagination -->
        <div class="bg-white px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ filteredData.length }}</span>
              results
            </div>
            <div class="flex items-center space-x-2">
              <button @click="currentPage = 1" :disabled="currentPage === 1" class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                First
              </button>
              <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                Previous
              </button>
              <div class="flex space-x-1">
                <button v-for="page in displayedPages" :key="page" @click="currentPage = page" class="pagination-button"
                  :class="{ 'bg-blue-600 text-white': currentPage === page }">
                  {{ page }}
                </button>
              </div>
              <button @click="currentPage++" :disabled="currentPage >= totalPages" class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                Next
              </button>
              <button @click="currentPage = totalPages" :disabled="currentPage >= totalPages" class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-bold mb-4">Approve OPEX</h3>
          <table class="w-full mb-4 min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="text-left">
                <th>Product</th>
                <th>SN</th>
                <th>Qty</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(data, index) in detail" :key="index"
                class="hover:bg-gray-50 transition-colors duration-150 text-sm"
                :class="data.product_stock == 0 ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-50'">
                <td class="text-sm text-gray-500">{{ data.product_desc }}</td>
                <td class="text-sm text-gray-500">{{ data.product_sn }}</td>
                <td class="text-sm text-gray-500">{{ data.quantity }}</td>
              </tr>
            </tbody>
          </table>
          <!-- <p class="mb-6">
            Are you sure you want to approve this OPEX? This action cannot be undone.
          </p> -->
          <div class="flex justify-end gap-3">
            <button @click="isModalOpen = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button @click="approveOpex(opex)" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Approve
            </button>
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
import { RouterLink, useRouter } from 'vue-router'
import { AddOpexApprove, GetAbsorb, GetOpex, Product } from '@/core/utils/url_api'
import ApiServices from '@/core/services/ApiServices'

export default defineComponent({
  name: 'OpexPage',
  components: {
    AdminLayout,
    RouterLink,
  },

  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showDeleteModal = ref(false)
    const opexToDelete = ref(null)
    const po_type = ref('')
    const isModalOpen = ref(false);

    // Table headers configuration
    const tableHeaders = [
      { key: 'opex_code', label: 'Opex Number' },
      { key: 'opex_name', label: 'Opex Name' },
      { key: 'customer_name', label: 'Customer name' },
      { key: 'opex_price', label: 'Price' },
      { key: 'opex_type', label: 'Type' },
      { key: 'actions', label: 'Actions' },
    ]

    // Filter and sort state
    const searchQuery = ref('');
    const sortBy = ref('opex_name');
    const minPrice = ref('');
    const maxPrice = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    // Data state
    const opexData = ref([])

    // Fetch OPEX data from API
    const fetchOpexData = async () => {
      loading.value = true
      try {
        const response = await ApiServices.get(GetOpex)
        opexData.value = response.data
      } catch (error) {
        console.error('Error fetching OPEX data:', error)
      } finally {
        loading.value = false
      }
    }

    const detail = ref([]);
    const opex_id = ref(0);


    const approve = async (id) => {
      isModalOpen.value = true;
      opex_id.value = id;
      ApiServices.get(GetAbsorb + '/' + id).then(
        (res) => {
          var data = res.data;
          for (let i = 0; i < data.length; i++) {
            var object = {
              opex_id: data[i].opex_id,
              product_id: data[i].product_id,
              product_desc: data[i].product.product_desc,
              product_sn: data[i].product.product_sn,
              product_stock: data[i].product.product_stock,
              quantity: data[i].quantity,
              price: data[i].price,
            };
            detail.value.push(object);
          }
        }
      )
    }

    const approveOpex = async () => {
      const hasZeroStock = detail.value.some(item => item.product_stock === 0);

      if (hasZeroStock) {
        alert('Terdapat Produk Dengan Stock 0')
        return;
      }

      await ApiServices.post(AddOpexApprove + '/' + opex_id.value, {
        detail: detail.value,
      }).then(
        (res) => {
          console.log(res);
        }
      )

      alert('Approve Berhasil');
    }

    onMounted(() => {
      fetchOpexData()
    })
    const monthNames = [
      '', // index 0 (not used)
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...opexData.value]
      if (po_type.value === '') {
        result = result.filter((opex) => opex.opex_type === 'absorb')
      }
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((opex) => {
          const opexname = opex.opex_name.toLowerCase();
          const customername = opex.customer ? opex.customer.customer_name.toLowerCase() : '';
          return (
            opexname.includes(query) ||
            customername.includes(query)
          )
        })
      }

      return result
    })

    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

    const endIndex = computed(() =>
      Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length),
    )

    const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

    const displayedPages = computed(() => {
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= totalPages.value; i++) {
        if (
          i === 1 ||
          i === totalPages.value ||
          (i >= currentPage.value - delta && i <= currentPage.value + delta)
        ) {
          range.push(i)
        }
      }

      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      })

      return rangeWithDots
    })

    // Utility functions
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    }

    const deleteOpex = async () => {
      try {
        loading.value = true
        // TODO: Implement API call
        // await api.delete(`/opex/${opexToDelete.value.opex_id}`)

        // Remove from local state
        opexData.value = opexData.value.filter(
          (opex) => opex.opex_id !== opexToDelete.value.opex_id,
        )

        showDeleteModal.value = false
        opexToDelete.value = null

        // Show success message
        alert('OPEX deleted successfully')
      } catch (error) {
        console.error('Error deleting OPEX:', error)
        alert('Failed to delete OPEX')
      } finally {
        loading.value = false
      }
    }

    const editData = async (id) => {
      router.push('opex-absorb/edit/' + id)
    }
    const formatDateWithMonthString = (dateStr) =>{
      // dateStr: '2025-01-08' or similar
      const date = new Date(dateStr)
      const day = date.getDate()
      const month = date.getMonth() + 1 // getMonth() returns 0-based
      const year = date.getFullYear()
      return `${monthNames[month]}`
    }

    const exportData = () => {
      const data = filteredData.value.map((opex) => ({
        Name: opex.opex_name,
        Code: opex.opex_code,
        Price: opex.opex_price,
        Bulan: formatDateWithMonthString(opex.issue_at),
        Type: opex.opex_type,
      }))

      // Create CSV content
      const headers = Object.keys(data[0])
      const csvContent = [
        headers.join(','),
        ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(',')),
      ].join('\n')

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', `opex-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    return {
      po_type,
      // State
      loading,
      showDeleteModal,
      searchQuery,
      isModalOpen,
      sortBy,
      minPrice,
      maxPrice,
      currentPage,
      itemsPerPage,
      tableHeaders,

      // Computed
      filteredData,
      paginatedData,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      detail,
      opexData,
      monthNames,

      // Methods      
      formatCurrency,
      deleteOpex,
      exportData,
      editData,
      approve,
      approveOpex,
    }
  },
})
</script>

<style scoped>
.pagination-button {
  @apply px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-group input,
.form-group select {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>