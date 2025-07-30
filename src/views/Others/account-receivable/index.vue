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
          <button @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            <span>Export</span>
          </button>
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search by name or account..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Balance Range</label>
            <div class="flex gap-2">
              <input type="number" v-model="minBalance" placeholder="Min"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="number" v-model="maxBalance" placeholder="Max"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Sort By</label>
            <select v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="status">Status</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="full">Full</option>
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
              <tr v-for="(account, index) in paginatedData" :key="account.id"
                class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="bg-yellow-400 text-slate-600 text-center px-2 rounded-xl" v-if="account.status_payment == 'partial'">
                    {{ account.status_payment }}
                  </div>
                  <div class="bg-green-400 text-slate-600 text-center px-2 rounded-xl"
                    v-else-if="account.status_payment == 'full'">
                    {{ account.status_payment }}
                  </div>
                  <div class="bg-slate-500 text-slate-200 text-center px-2 rounded-xl" v-else>
                    {{ account.status_payment }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ account.code_invoice }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ account.customer.customer_name }}
                  </div>
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ account.issue_at }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ account.due_at }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ calculateDay(account.issue_at, account.due_at) }} days
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-3">
                    <!-- <button @click="viewDetails(account)" class="text-blue-600 hover:text-blue-900">
                      View
                    </button> -->
                    <button @click="openModal(account)" class="text-green-600 hover:text-green-900">
                      Posting
                    </button>
                    <button v-if="account.status_payment != 'unpaid'" @click="resetPrice(account)"
                      class="text-yellow-600 hover:text-yellow-900">
                      Reset
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="isModalOpen"
            class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
            <div class="bg-white p-8 rounded-xl w-96 shadow-xl transform transition-all duration-300">
              <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Edit Deposit</h2>

              <!-- Total Amount Display -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                <div class="p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <span class="text-lg font-semibold text-gray-800">Rp. {{ selectedItem ?
                    formatCurrency(selectedItem.grand_total) : 0 }}</span>
                </div>
              </div>

              <!-- Current Deposit Display -->
              <div class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-1">Current Deposit</label>
                <div class="p-3 bg-gray-100 rounded-lg border border-gray-200">
                  <span class="text-lg font-semibold text-gray-800">Rp. {{ selectedItem ?
                    formatCurrency(selectedItem.deposit) : 0 }}</span>
                </div>
              </div>

              <!-- New Additional Deposit Input -->
              <div class="mb-5">
                <label for="deposit-amount" class="block text-sm font-medium text-gray-700 mb-2">
                  Issue At
                </label>
                <div class="relative">
                  <div class="flex space-x-3">
                    <input id="Issue At" type="date" v-model="issue_today"
                      class="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                  </div>
                </div>
              </div>

              <!-- New Additional Deposit Input -->
              <div class="mb-5">
                <label for="deposit-amount" class="block text-sm font-medium text-gray-700 mb-2">
                  Additional Deposit Amount
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp.</span>
                  <div class="flex space-x-3">
                    <input id="deposit-amount" type="number" v-model.number="additionalDeposit"
                      class="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="0.00" />
                    <button
                      class="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      @click="additionalDeposit = selectedItem.grand_total - selectedItem.deposit">
                      Lunas
                    </button>
                  </div>
                </div>
              </div>

              <!-- Total After Change -->
              <div class="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-blue-800">New Deposit:</span>
                  <span class="text-lg font-bold text-blue-800">
                    Rp.
                    {{
                      selectedItem ? formatCurrency(Number(selectedItem.deposit || 0) + Number(additionalDeposit || 0)) :
                        0
                    }}
                  </span>
                </div>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded-lg transition-colors duration-200"
                  @click="closeModal">
                  Cancel
                </button>
                <button
                  class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors duration-200 flex items-center"
                  @click="saveDeposit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
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

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 class="text-lg font-bold mb-4">Confirm Delete</h3>
          <p class="mb-6">
            Are you sure you want to delete this account? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button @click="deleteAccount" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
import { AccReceive, AccUpdateDeposit, AccUpdateReset } from '@/core/utils/url_api'
import Swal from 'sweetalert2'
import ApiServices from '@/core/services/ApiServices'

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
      { key: 'status', label: 'Status' },
      { key: 'no', label: 'Code Invoice' },
      { key: 'name', label: 'Name' },
      { key: 'Terbayar', label: 'Terbayar' },
      { key: 'Amount', label: 'Amount' },
      { key: 'Debt', label: 'Debt' },
      { key: 'Debt', label: 'Issue Date' },
      { key: 'Debt', label: 'Due Date' },
      { key: 'Debt', label: 'Aging' },
      { key: 'actions', label: 'Actions' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('status')
    const minBalance = ref('')
    const maxBalance = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const issue_today = new Date().toLocaleDateString('en-CA');

    // Sample data - replace with API call
    const accounts = ref([])

    const getArcheive = async () => {
      try {
        const res = await ApiServices.get(AccReceive)
        accounts.value = res.data
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    onMounted(() => {
      getArcheive()
    })

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...accounts.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => {
          const name = entry.customer.customer_name.toLowerCase();
          const code_invoice = entry.code_invoice.toLowerCase();
          return name.includes(query) ||
            code_invoice.includes(query)
        })
      }
      if (sortBy.value === 'status') {
        result = result.filter((account) => account.grand_total - account.deposit > 0)
      } else if (sortBy.value === 'unpaid') {
        result = result.filter(a => a.status_payment === 'unpaid')
      } else if (sortBy.value === 'partial') {
        result = result.filter(a => a.status_payment === 'partial')
      } else if (sortBy.value === 'full') {
        result = result.filter(a => a.status_payment === 'full')
      } 

      return result
    })

    const calculateDay = (issue_at, due_at) => {
      const today = new Date();
      const due_date = new Date(due_at);

      const timeDiff = due_date.getTime() - today.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return dayDiff;
    }

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

    const additionalDeposit = ref(0)

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
      router.push(`/account-receivable/${account.id_so}`)
    }

    const editAccount = (account) => {
      router.push(`/account-receivable/edit/${account.id}`)
    }
    const isModalOpen = ref(false)
    const selectedItem = ref(null)
    const editedDeposit = ref(0)

    function openModal(item) {
      selectedItem.value = item
      editedDeposit.value = item.deposit
      additionalDeposit.value = 0
      isModalOpen.value = true
    }

    function closeModal() {
      isModalOpen.value = false
      selectedItem.value = null
    }


    async function saveDeposit() {
      if (selectedItem.value) {
        try {
          const deposit = Number(selectedItem.value.deposit || 0) + Number(additionalDeposit.value || 0);

          var status_payment = 'unpaid';
          if (selectedItem.value.deposit = deposit) {
            status_payment = 'full';
          } else {
            status_payment = 'partial';
          }

          const response = await ApiServices.put(AccUpdateDeposit + '/' + selectedItem.value.id_invoice, {
            id_invoice: selectedItem.value.id_invoice,
            payment_method: 'Transfer',
            status_payment: status_payment,
            deposit: deposit,
            issue_at: issue_today,
            due_at: issue_today
          });

          if (response.status === 200) {
            closeModal()
            Swal.fire({
              icon: 'success',
              title: 'Has Been Paid'
            }).then((res) => {
              if (res.isConfirmed) {
                window.location.reload();
              }
            })
          }
        } catch (error) {
          console.error('Failed to update deposit:', error)
        }
      }
      closeModal()
    }

    async function resetPrice(item) {
      if (item) {
        Swal.fire({
          icon: 'warning',
          title: 'Apakah Anda ingin Mengulang Pembayaran ini?'
        }).then((res) => {
          if (res.isConfirmed) {
            var status_payment = 'unpaid';
            var deposit = 0;

            ApiServices.put(AccUpdateReset + '/' + item.id_invoice, {
              deposit: deposit,
              status_payment: status_payment,
            }).then(
              (res) => {
                if (res.status === 200) {
                  window.location.reload();
                }
              }
            )
          }
        })
      }
    }

    const confirmDelete = (account) => {
      accountToDelete.value = account
      showDeleteModal.value = true
    }

    const deleteAccount = async () => {
      try {
        loading.value = true
        accounts.value = accounts.value.filter((account) => account.id !== accountToDelete.value.id)
        showDeleteModal.value = false
        accountToDelete.value = null
        alert('Account deleted successfully')
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Failed to delete account')
      } finally {
        loading.value = false
      }
    }

    const exportData = () => {
      const data = accounts.value.map((account) => ({
        'Code Po': account.code_invoice,
        Customer: account.customer.customer_name,
        Deposit: account.deposit,
        Amount: account.grand_total,
        Debt: account.grand_total - account.deposit,
        'Issue Date': account.issue_at,
        'Due Date': account.due_at,
        Aging: calculateDay(account.issue_at, account.due_at),
        'Status AR': account.grand_total = account.deposit ? "Paid" : "Partial",
        'Payment Method': account.paymentsales.payment_method ? account.paymentsales.payment_method : "",
        'Payment Date': account.paymentsales.issue_at ? account.paymentsales.issue_at : ""
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
      issue_today,
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
      openModal,
      closeModal,
      saveDeposit,
      calculateDay,
      resetPrice,
      isModalOpen,
      selectedItem,
      editedDeposit,
      showDeleteModal,
      additionalDeposit,
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
