<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Account Receivable Management</h1>
          <p class="text-gray-500 text-sm mt-1">Master Data / Account Receivable</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <span>Export</span>
          </button>
          <RouterLink
            to="/account-receivable/form"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Add New Account
          </RouterLink>
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
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
            <label class="text-sm font-medium text-gray-600 mb-2 block">Balance Range</label>
            <div class="flex gap-2">
              <input
                type="number"
                v-model="minBalance"
                placeholder="Min"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                v-model="maxBalance"
                placeholder="Max"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Sort By</label>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="balance">Balance</option>
              <option value="accountNumber">Account Number</option>
              <option value="date">Date Created</option>
            </select>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Items per page</label>
            <select
              v-model="itemsPerPage"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
              <tr v-if="loading" class="text-center">
                <td colspan="5" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center">
                <td colspan="5" class="px-6 py-4">No data found</td>
              </tr>
              <tr
                v-for="(account, index) in paginatedData"
                :key="account.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ account.code_so }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ account.customer.customer_name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(account.deposit) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(account.grand_total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(account.grand_total - account.deposit) }}
                </td>                
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <button @click="viewDetails(account)" class="text-blue-600 hover:text-blue-900">
                      View
                    </button>
                    <button
                      @click="editAccount(account)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                    <button @click="confirmDelete(account)" class="text-red-600 hover:text-red-900">
                      Delete
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

      <!-- Delete Confirmation Modal -->
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-bold mb-4">Confirm Delete</h3>
          <p class="mb-6">
            Are you sure you want to delete this account? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              @click="deleteAccount"
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
import axios from 'axios'
import { AccReceive } from '@/core/utils/url_api'

export default defineComponent({
  name: 'AccountReceivablePage',
  components: {
    AdminLayout,
    RouterLink,
  },

  setup() {
    const router = useRouter()
    const loading = ref(false)
    const showDeleteModal = ref(false)
    const accountToDelete = ref(null)

    // Table headers configuration
    const tableHeaders = [
      { key: 'no', label: 'Code So' },
      { key: 'name', label: 'Name' },
      { key: 'Depoit', label: 'Depoit' },
      { key: 'Amount', label: 'Amount' },
      { key: 'Debt', label: 'Debt' },
      { key: 'actions', label: 'Actions' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('name')
    const minBalance = ref('')
    const maxBalance = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Sample data - replace with API call
    const accounts = ref([])

    const getArcheive = async() => { 
      await axios.get(AccReceive).then(
        (res) => {
          var data = res.data;
          accounts.value = data;
        }
      )
    }

    onMounted(() => {
      getArcheive();
    })

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...accounts.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (account) =>
            account.name.toLowerCase().includes(query) || account.accountNumber.includes(query),
        )
      }

      if (minBalance.value) {
        result = result.filter((account) => account.balance >= minBalance.value)
      }

      if (maxBalance.value) {
        result = result.filter((account) => account.balance <= maxBalance.value)
      }

      result.sort((a, b) => {
        if (sortBy.value === 'balance') {
          return a.balance - b.balance
        }
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

    const viewDetails = (account) => {
      router.push(`/account-receivable/${account.id}`)
    }

    const editAccount = (account) => {
      router.push(`/account-receivable/edit/${account.id}`)
    }

    const confirmDelete = (account) => {
      accountToDelete.value = account
      showDeleteModal.value = true
    }

    const deleteAccount = async () => {
      try {
        loading.value = true
        // TODO: Implement API call
        // await api.delete(`/accounts/${accountToDelete.value.id}`)

        // Remove from local state
        accounts.value = accounts.value.filter((account) => account.id !== accountToDelete.value.id)

        showDeleteModal.value = false
        accountToDelete.value = null

        // Show success message
        alert('Account deleted successfully')
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Failed to delete account')
      } finally {
        loading.value = false
      }
    }

    const exportData = () => {
      const data = filteredData.value.map((account) => ({
        Name: account.name,
        'Account Number': account.accountNumber,
        Balance: formatCurrency(account.balance),
        'Date Created': account.dateCreated,
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
      a.setAttribute('download', `account-receivable-${new Date().toISOString().split('T')[0]}.csv`)
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
      minBalance,
      maxBalance,
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
      editAccount,
      confirmDelete,
      deleteAccount,
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
