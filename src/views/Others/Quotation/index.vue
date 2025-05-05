<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-300">Quotation</h1>
          <p class="text-gray-400 text-sm mt-1">Others / Quotation</p>
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
              to="/quotation/form"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add New Quotation
            </RouterLink>
          </button>
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by Quotation ID or description..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- Enhanced Table Section -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="header in tableHeaders"
                  :key="header.key"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:bg-gray-800"
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
              <tr v-if="loading" class="text-center">
                <td colspan="5" class="px-6 py-4">Loading...</td>
              </tr>
              <tr
                v-else-if="paginatedData.length === 0"
                class="text-center dark:bg-gray-800 dark:text-gray-400"
              >
                <td colspan="5" class="px-6 py-4">No data found</td>
              </tr>
              <tr
                v-for="(entry, index) in paginatedData"
                :key="entry.id"
                class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {{ entry.code_quatation }}
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
                  <button
                    @click="viewData(entry.id_quatation)"
                    class="mx-2 px-3 py-2 rounded-lg shadow-lg border"
                  >
                    View
                  </button>
                  <button
                    @click="editData(entry.id_quatation)"
                    class="shadow-lg mr-2 px-3 py-2 rounded-lg border"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteData(entry.id_quatation)"
                    class="shadow-lg mr-2 px-3 py-2 rounded-lg border"
                  >
                    Delete
                  </button>
                  <button @click="exportToPDF(entry)" class="shadow-lg px-3 py-2 rounded-lg border">
                    Export To PDF
                  </button>
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
            <div class="text-sm text-gray-400">
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
                :class="{ 'opacity-50 cursor-not-allowed ': currentPage === 1 }"
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
import { defineComponent, ref, computed, onMounted, createApp, h } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import axios from 'axios'
import QuotationPdfTemplate from '@/components/templates/pdf/quotation_pdf.vue'
import { DetailQuatation, Quatations, QuatationsDelete } from '@/core/utils/url_api'
import router from '@/router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Swal from 'sweetalert2'
import { exportQuoPDF } from '@/core/helpers/exportToPdf'

export default defineComponent({
  name: 'QuotationPage',
  components: {
    AdminLayout,
  },

  setup() {
    const loading = ref(false)

    // Table headers configuration
    const tableHeaders = [
      { key: 'code_quatation', label: 'Quotation Number' },
      { key: 'customer', label: 'Customer Name' },
      { key: 'sub_total', label: 'Amount' },
      { key: 'issue_at', label: 'Date' },
      { key: 'action', label: 'Action' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('description')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Sample data - replace with API call
    const entries = ref([]);
    const dataexcel = ref([]);

    const Quatation = async () => {
      await axios.get(Quatations).then((res) => {
        var data = res.data
        entries.value = data
      })
    }

    const detailQuo = async () => {
      try {
        await axios.get(DetailQuatation).then((res) => {
          dataexcel.value = res.data;
        })
      } catch (error) {
        console.error('Error fetching quotation details:', error)
      }
    }

    onMounted(() => {
      Quatation();
      detailQuo();    
    })

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...entries.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => {
          const code_quatation = entry.code_quatation.toLowerCase()
          const customer = entry.customer.customer_name.toLowerCase()
          return code_quatation.includes(query) || customer.includes(query)
        })
      }      

      return result
    })

    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

    const endIndex = computed(() =>
      Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length),
    )

    const viewData = (id) => {
      router.push('/quotation/view/' + id)
    }
    const editData = (id) => {
      router.push('/quotation/edit/' + id)
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
          await axios.delete(QuatationsDelete + '/' + id)
          await Quatation()
          Swal.fire('Deleted!', 'The quotation has been deleted.', 'success')
        } catch (error) {
          Swal.fire('Error!', 'There was an error deleting the quotation.', 'error')
        }
      }
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
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    }

    const exportData = () => {
      const data = dataexcel.value.map((entry) => ({
        'Quotation Number' : entry.quo.code_quatation,
        'Customer': entry.quo.customer.customer_name,
        'Product Desc': entry.product.product_desc,
        'Product SN' : entry.product.product_sn,
        'Sub Total': entry.quo.sub_total,
        'Issue At': entry.quo.issue_at,
        'Due At': entry.quo.due_at,
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
      a.setAttribute('download', `quotation-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    const exportToPDF = (item) => {
      exportQuoPDF(item)
    }

    return {
      viewData,
      editData,
      deleteData,

      // State
      loading,
      searchQuery,
      sortBy,
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
      formatCurrency,
      exportData,
      exportToPDF,
    }
  },
})
</script>

<style scoped>
.pagination-button {
  @apply px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400;
}

.form-group input,
.form-group select {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>
