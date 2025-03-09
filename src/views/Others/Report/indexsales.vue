<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Report Sales Management</h1>
          <p class="text-gray-500 text-sm mt-1">Sales / Report </p>
        </div>
        <div class="flex gap-3">
          <button
            @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <span>Export</span>
          </button>          
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Customer name</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by name or account..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Issue At</label>
            <div class="flex gap-2">
              <input
                type="date"                
                placeholder="Min"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"                
                placeholder="Max"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>          
        </div>
      </div>

      <!-- Enhanced Table Section -->


      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-bold mb-4">Confirm Delete</h3>
          <p class="mb-6">
            Are you sure you want to delete this report? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              @click="deleteReport"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { RouterLink, useRouter } from 'vue-router'
import { Invoice } from '@/core/utils/url_api';

import axios from 'axios'

export default defineComponent({
  name: 'ReportPage',
  components: {
    AdminLayout,
    RouterLink,
  },

  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showDeleteModal = ref(false)
    const reportToDelete = ref(null)

    // Table headers configuration
    const tableHeaders = [          
      { key: 'Customer', label: 'Customer Name' },      
      { key: 'issue_at', label: 'Issue Date' },
      { key: 'due_at', label: 'Due Date' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('name')
    const minAmount = ref('')
    const startDate = ref('')
    const endDate = ref('')
    const maxAmount = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const invoice = ref([]); 

    // Sample data - replace with API call
    const reportData = ref([])

    const getInvoices = async() => {
      const response = await axios.get(Invoice)
      invoice.value = response.data;   
    }

    onMounted(() => {
      getInvoices();
    });

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...invoice.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => entry.code_invoice.toLowerCase().includes(query))
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
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    }

    const formatAccountNumber = (number) => {
      return number.replace(/(\d{4})/g, '$1 ').trim()
    }

    const viewDetails = (report) => {
      router.push(`/report/${report.id}`)
    }

    const editReport = (report) => {
      router.push(`/report/edit/${report.id}`)
    }

    const confirmDelete = (report) => {
      reportToDelete.value = report
      showDeleteModal.value = true
    }

    const deleteReport = async () => {
      try {
        loading.value = true
        // TODO: Implement API call
        // await api.delete(`/report/${reportToDelete.value.id}`)

        // Remove from local state
        reportData.value = reportData.value.filter(
          (report) => report.id !== reportToDelete.value.id,
        )

        showDeleteModal.value = false
        reportToDelete.value = null

        // Show success message
        alert('Report deleted successfully')
      } catch (error) {
        console.error('Error deleting report:', error)
        alert('Failed to delete report')
      } finally {
        loading.value = false
      }
    }

    const exportData = () => {
      const data = filteredData.value.map((report) => ({
        Name: report.name,
        'Account Number': report.accountNumber,
        Amount: formatCurrency(report.amount),
        'Date Created': report.dateCreated,
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
      a.setAttribute('download', `report-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    return {
      // State
      loading,
      showDeleteModal,
      searchQuery,
      sortBy,
      minAmount,
      maxAmount,
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
      formatAccountNumber,
      viewDetails,
      editReport,
      confirmDelete,
      deleteReport,
      exportData,
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
