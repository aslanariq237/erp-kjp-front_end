<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Bank Account Management</h1>
          <p class="text-gray-500 text-sm mt-1">Master Data / Bank Account</p>
        </div>
        <RouterLink
          to="/bank-account/form"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          Add New Bank Account
        </RouterLink>
      </div>

      <!-- Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="text-sm text-gray-600 mb-1 block">Search</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search bank accounts..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="form-group">
            <label class="text-sm text-gray-600 mb-1 block">Sort By</label>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="account_name">Account Name</option>
              <option value="bank_name">Bank Name</option>
              <option value="location">Location</option>
              <option value="nama_usaha">Nama Usaha</option>
              <option value="kode_cabang">Kode Cabang</option>
              <option value="swift_code">SWIFT Code</option>
              <option value="currency_code">Currency Code</option>
            </select>
          </div>
          <div class="form-group">
            <label class="text-sm text-gray-600 mb-1 block">Items per page</label>
            <select
              v-model="itemsPerPage"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                No
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Account Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bank Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Usaha
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kode Cabang
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SWIFT Code
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Currency Code
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(account, index) in paginatedData"
              :key="account.id_bank_account"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ account.account_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ account.bank_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ account.location }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ account.nama_usaha }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ account.kode_cabang }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ account.swift_code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ account.currency_code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="editAccount(account)" class="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                  <button @click="deleteAccount(account)" class="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
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
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    currentPage === page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="currentPage++"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
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
import { GetBankAccount } from '@/core/utils/url_api'

export default defineComponent({
  name: 'BankAccountPage',
  components: {
    AdminLayout,
  },

  setup() {
    // Data
    const accounts = ref([])

    // Fetch accounts from API
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(GetBankAccount)
        accounts.value = response.data
      } catch (error) {
        console.error('Error fetching accounts:', error)
      }
    }

    onMounted(() => {
      fetchAccounts()
    })

    // Filtering and Sorting
    const searchQuery = ref('')
    const sortBy = ref('account_name')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    const filteredData = computed(() => {
      let result = [...accounts.value]

      // Search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (account) =>
            account.account_name.toLowerCase().includes(query) ||
            account.bank_name.toLowerCase().includes(query),
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

    // Pagination
    const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value))

    const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

    const endIndex = computed(() =>
      Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length),
    )

    const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

    // Utility functions
    const editAccount = (account) => {
      console.log('Edit account:', account)
      // Implement edit logic
    }

    const deleteAccount = (account) => {
      if (confirm('Are you sure you want to delete this account?')) {
        console.log('Delete account:', account)
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
      editAccount,
      deleteAccount,
      accounts,
    }
  },
})
</script>
