<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Good Receive</h1>
          <p class="text-gray-500 text-sm mt-1">SCM / Good Receive</p>
        </div>
        <div class="flex gap-3">
          <button @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search by code..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Date Range</label>
            <div class="flex gap-2">
              <input type="date" v-model="startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="date" v-model="endDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:text-gray-400">
              <tr v-if="loading" class="text-center">
                <td colspan="14" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center dark:bg-gray-800 dark:text-gray-400">
                <td colspan="14" class="px-6 py-4">No data found</td>
              </tr>
              <tr v-for="(entry, index) in paginatedData" :key="entry.id_po"
                class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ entry.code_po }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.vendor.vendor_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.has_gr == 1 ? "Full" : "Parsial" }}
                </td>                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(entry.sub_total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.issue_at }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.due_at }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>                         
                    <button :class="{'bg-green-500': entry.has_gr != 1, 'bg-green-300': entry.has_gr == 1, 'px-3 py-2 rounded-lg text-white': true}"
                      @click="viewData(entry.id_po)" :disabled="entry.has_gr == 1">                    
                    Add
                    </button>
                  </div>                  
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
    </div>
  </AdminLayout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import axios from 'axios';
import { DetailPo, PurchaseOrder } from '@/core/utils/url_api';
import router from '@/router';

export default defineComponent({
  name: 'PurchaseOrderPage',
  components: {
    AdminLayout,
  },

  setup() {
    const loading = ref(false)

    // Table headers configuration
    const tableHeaders = [
      { key: 'code_po', label: 'Code PO' },
      { key: 'vendor_name', label: 'Vendor' },
      { key: 'quality_check', label: 'Quality Check' },      
      { key: 'sub_total', label: 'Sub Total' },
      { key: 'issue_at', label: 'Issue Date' },
      { key: 'due_at', label: 'Due Date' },
      { key: 'Action', label: 'Action' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('code_po')
    const startDate = ref('')
    const endDate = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Sample data - replace with API call
    const entries = ref([])
    const dataexcel = ref([]);

    const getPurchaseOrder = async () => {
      try {
        const res = await axios.get(PurchaseOrder)
        entries.value = res.data;
      } catch (error) {
        console.error('Error Fetching : ', error)
      }
    }

    const getDetailPO = async() => {
      try {
        await axios.get(DetailPo).then((res) => {
          dataexcel.value = res.data;
        });
      } catch (error) {
        console.error('Error Fetching : ', error)        
      }
    }
    onMounted(() => {
      getPurchaseOrder();
      getDetailPO();
    })

    const viewData = (id) => {
      
      router.push('/good-receive/add/' + id);
    }

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...entries.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => {
          const code_po = entry.code_po.toLowerCase();
          const vendor_name = entry.vendor.vendor_name.toLowerCase();
          return code_po.includes(query) || vendor_name.includes(query)
        })
      }

      if (startDate.value) {
        result = result.filter((entry) => new Date(entry.issue_at) >= new Date(startDate.value))
      }

      if (endDate.value) {
        result = result.filter((entry) => new Date(entry.issue_at) <= new Date(endDate.value))
      }

      result.sort((a, b) => {
        return String(a[sortBy.value]).localeCompare(String(b[sortBy.value]))
      })

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
    const exportData = () => {
      const data = dataexcel.value.map((entry) => ({
        'Po Number' : entry.purchaseorders.code_po,
        'Vendor Name' : entry.purchaseorders.vendor.vendor_name,
        'Product Decs' : entry.product.product_desc,
        'product SN' : entry.product.product_sn,        
        'Has GR' : entry.purchaseorders.has_gr == 1 ? "Full" : "Parsial",
        'Issue Date' : entry.purchaseorders.issue_at,
        'Due Date' : entry.purchaseorders.due_at,
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
      a.setAttribute('download', `good-receive-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
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
      tableHeaders,

      // Computed
      filteredData,
      paginatedData,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,

      // Methods
      exportData,
      formatCurrency,
    }
  },
})
</script>

<style scoped>
.pagination-button {
  @apply px-3 py-1 border border-gray-300 rounded-md dark:text-gray-400 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.form-group label {
  @apply block text-sm font-medium dark:text-gray-400 text-gray-700 mb-1;
}

.form-group input,
.form-group select {
  @apply block w-full dark:bg-gray-800 dark:text-gray-400 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>
