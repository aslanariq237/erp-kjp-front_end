<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6 dark:text-gray-400">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Sales Order</h1>
          <p class="text-gray-500 text-sm mt-1">Sales / Sales Order</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <span>Export</span>
          </button>
          <button>
            <RouterLink
              to="/sales-order/form"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add New Sales Order
            </RouterLink>
          </button>
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by code..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Date Range</label>
            <div class="flex gap-2">
              <input
                type="date"
                v-model="startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                v-model="endDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Table Section -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:bg-gray-800 dark:text-gray-400">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="header in tableHeaders"
                  :key="header.key"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400"
                  @click="sortBy = header.key"
                >
                  <div class="flex items-center gap-2">
                    {{ header.label }}
                    <span v-if="sortBy === header.key">↓</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:text-gray-400">
              <tr v-if="loading" class="text-center">
                <td colspan="14" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center">
                <td colspan="14" class="px-6 py-4 dark:bg-gray-800 dark:text-gray-400">
                  No data found
                </td>
              </tr>
              <tr
                v-for="(entry, index) in paginatedData"
                :key="entry.id_so"
                class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-500">{{ entry.code_so }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-500">{{ entry.po_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ entry.customer.customer_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ formatCurrency(entry.sub_total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ entry.issue_at }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ entry.due_at }}
                </td>                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  <button
                    @click="viewData(entry.id_so)"
                    class="mx-2 px-3 py-2 rounded-lg shadow-lg border"
                  >
                    View
                  </button>
                  <span v-if="entry.has_invoice === 0">
                    <button                    
                      @click="editData(entry.id_so)"
                      class="shadow-lg mr-2 px-3 py-2 rounded-lg border"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteData(entry.id_so)"
                      class="shadow-lg mr-2 px-3 py-2 rounded-lg border"
                    >
                      Delete
                    </button>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Enhanced Pagination -->
        <div
          class="bg-white px-6 py-4 border-t border-gray-200 dark:bg-gray-800 dark:text-gray-400"
        >
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
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                First
              </button>
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Previous
              </button>
              <div class="flex space-x-1">
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="currentPage = page"
                  class="pagination-button"
                  :class="{ 'bg-blue-600 text-white': currentPage === page }"
                >
                  {{ page }}
                </button>
              </div>
              <button
                @click="currentPage++"
                :disabled="currentPage >= totalPages"
                class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
              >
                Next
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage >= totalPages"
                class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import axios from 'axios'
import { SalesOrders, SalesOrderDelete, DetailSo } from '@/core/utils/url_api'
import Swal from 'sweetalert2'
import router from '@/router'
export default defineComponent({
  name: 'SalesOrderPage',
  components: {
    AdminLayout,
  },

  setup() {
    const loading = ref(false)

    // Table headers configuration
    const tableHeaders = [
      { key: 'code_so', label: 'So Number' },
      { key: 'po_number', label: 'Po Number' },
      { key: 'customer', label: 'Customer' },
      { key: 'sub_total', label: 'Sub Total' },
      { key: 'issue_at', label: 'Issue Date' },
      { key: 'due_at', label: 'Due Date' },
      { key: 'action', label: 'Action' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('code_so')
    const startDate = ref('')
    const endDate = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Sample data - replace with API call
    const entries = ref([])
    const dataexcel = ref([])

    const GetSalesOrder = async () => {
      try {
        const res = await axios.get(SalesOrders)
        entries.value = res.data
      } catch (error) {
        console.error('Error Fetching : ', error)
      }
    }

    const GetDetailSo = async () => {
      try {
        await axios.get(DetailSo).then((res) => {
          dataexcel.value = res.data;
        }).catch((error) => {
          console.error('Error Fetching : ', error)
        })
      } catch (error) {
        console.error('Error Fetching : ', error)  
      }    
    }

    onMounted(() => {
      GetSalesOrder()
      GetDetailSo();
    })

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...entries.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => {
          const code_so = entry.code_so.toLowerCase()
          const po_number = entry.po_number.toLowerCase()
          const customer = entry.customer.customer_name.toLowerCase()
          return code_so.includes(query) || po_number.includes(query) || customer.includes(query)
        })
      }

      return result
    })

    const viewData = (id) => {
      router.push('/sales-order/view/' + id)
    }

    const editData = (id) => {
      router.push('/sales-order/edit/' + id)
    }
    const deleteData = async (id) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      })

      if (result.isConfirmed) {
        try {
          await axios.delete(SalesOrderDelete + '/' + id)
          await GetSalesOrder()
          Swal.fire('Deleted!', 'The Sales Order has been deleted.', 'success')
        } catch (error) {
          Swal.fire('Error!', 'There was an error deleting the Sales Order.', 'error')
        }
      }
    }

    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

    const endIndex = computed(() =>
      Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length),
    )

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    }

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
    const exportData = () => {            
      const data = dataexcel.value.map((entry) => ({
        'SO Number' : entry.salesorders.code_so,
        'PO Number' : entry.salesorders.po_number,
        'customer' : entry.salesorders.customer.customer_name,        
        'product description': entry.product.product_desc,
        'product SN' : entry.product.product_sn,
        'Quantity': entry.quantity,
        'Price' : entry.price,        
        'issue date' : entry.salesorders.issue_at,
        'due date' : entry.salesorders.due_at,
      }));      

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
      a.setAttribute('download', `sales-order-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    return {
      viewData,
      editData,
      deleteData,

      // State
      loading,
      searchQuery,
      sortBy,
      startDate,
      endDate,
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
      entries,

      // Methods
      exportData,
      formatCurrency,
    }
  },
})
</script>

<style scoped>
.pagination-button {
  @apply px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-400;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400;
}

.form-group input,
.form-group select {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:text-gray-400;
}
</style>
