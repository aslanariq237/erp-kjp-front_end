<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Delivery Order</h1>
          <p class="text-gray-500 text-sm mt-1">Others / Delivery Order</p>
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
              to="/delivery-order/form"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add New Delivery Order
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
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr class="dark:bg-gray-800 dark:text-gray-400">
                <th
                  v-for="header in tableHeaders"
                  :key="header.key"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  @click="sortBy = header.key"
                >
                  <div class="flex items-center gap-2">
                    {{ header.label }}
                    <span v-if="sortBy === header.key">↓</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading" class="text-center dark:bg-gray-800 dark:text-gray-400">
                <td colspan="14" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center dark:bg-gray-800 dark:text-gray-400">
                <td colspan="14" class="px-6 py-4">No data found</td>
              </tr>
              <tr
                v-for="(entry, index) in paginatedData"
                :key="entry.id_do"
                class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400"
              > 
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.code_do }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.salesorder.code_so }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.salesorder.po_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.customer.customer_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.issue_at }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    @click="viewData(entry.id_do)"
                    class="mx-2 px-3 py-2 rounded-lg shadow-lg border"
                  >
                    View
                  </button>                  
                  <button @click="exportToPDF(entry)" class="shadow-lg px-3 py-2 rounded-lg border">
                    Export
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Enhanced Pagination -->
        <div class="bg-white px-6 py-4 border-t border-gray-200 dark:bg-gray-800 dark:text-gray-400">
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
import axios from 'axios'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { RouterLink, useRoute } from 'vue-router'
import { DeliveryOrder, DetailDo } from '@/core/utils/url_api'
import DoPdfTemplate from '@/components/templates/pdf/do_pdf.vue'
import html2canvas from 'html2canvas'
import { createApp, h } from 'vue'
import router from '@/router'
import jsPDF from 'jspdf'
import { exportDoPDF } from '@/core/helpers/exportToPdf'

export default defineComponent({
  name: 'DeliveryOrderPage',
  components: {
    AdminLayout,
    RouterLink,
  },

  setup() {
    // Data
    const entries = ref([]);
    const dataexcel = ref([]);
    const loading = ref(false)

    // Fetch delivery orders from API
    const fetchDeliveryOrders = async () => {
      loading.value = true
      try {
        const response = await axios.get(DeliveryOrder)
        entries.value = response.data  
        var data = response.data;        
      } catch (error) {
        console.error('Error fetching delivery orders:', error)
      } finally {
        loading.value = false
      }
    }

    const getDetailDO = async() => {
      try {
        await axios.get(DetailDo).then((res) => {
          dataexcel.value = res.data;
        })
      } catch (error) {
        console.error('Error fetching delivery orders:', error)
      } 
    } 

    onMounted(() => {
      fetchDeliveryOrders()
      getDetailDO();      
    })

    // Filtering and Sorting
    const searchQuery = ref('')
    const sortBy = ref('code_do')
    const startDate = ref('')
    const endDate = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const filteredData = computed(() => {
      let result = [...entries.value]

      // Search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => {
          const code_do = entry.code_do.toLowerCase()
          const code_so = entry.salesorder.code_so.toLowerCase()
          const customer = entry.customer.customer_name.toLowerCase()
          const code_po = entry.salesorder.po_number.toLowerCase()
          return code_do.includes(query) || 
                code_po.includes(query) || 
                code_so.includes(query) ||
                customer.includes(query)
        });
      }

      // Date Range Filter
      if (startDate.value) {
        result = result.filter((entry) => new Date(entry.issue_at) >= new Date(startDate.value))
      }

      if (endDate.value) {
        result = result.filter((entry) => new Date(entry.issue_at) <= new Date(endDate.value))
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

    const viewData = (id) => {
      router.push('/delivery-order/view/' + id)
    }

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
        'SO Number' : entry.do.salesorder.code_so,
        'PO Number' : entry.do.salesorder.po_number,
        'DO Number' : entry.do.code_do,
        'customer' : entry.do.customer.customer_name,
        'Product Desc' : entry.product.product_desc,
        'Product SN' : entry.product.product_sn,
        'Quantity' : entry.qty,
        'issue date' : entry.do.issue_at,
        'due date' : entry.do.due_at,
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
      a.setAttribute('download', `delivery-order-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
    const exportToPDF = (item) => {
      exportDoPDF(item);
    }
    return {
      viewData,      
      // State
      loading,
      searchQuery,
      sortBy,
      startDate,
      endDate,
      currentPage,
      itemsPerPage,
      tableHeaders: [
        { key: 'code_do', label: 'DO Number' },
        { key: 'code_so', label: 'SO Number' },
        { key: 'po_number', label: 'Po Number' },
        { key: 'customer', label: 'Customer Name' },
        { key: 'issue_at', label: 'Issue Date' },
        { key: 'action', label: 'Action' },
      ],

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
      exportToPDF,
    }
  },
})
</script>

<style scoped>
.pagination-button {
  @apply px-3 py-1 dark:text-gray-400 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400;
}

.form-group input,
.form-group select {
  @apply block w-full rounded-md dark:bg-gray-800 dark:text-gray-400 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>
