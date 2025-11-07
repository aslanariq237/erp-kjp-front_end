<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">OPEX Cogs</h1>
          <p class="text-gray-500 text-sm mt-1">Opex Cogs</p>
        </div>
        <div class="flex gap-3">
          <button @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            <span>Export</span>
          </button>
          <RouterLink to="/opex-cogs/form"
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
                    <button @click="viewDetails(opex)" class="text-blue-600 hover:text-blue-900">
                      View
                    </button>
                    <button @click="editOpex(opex)" class="text-green-600 hover:text-green-900">
                      Edit
                    </button>
                    <button @click="confirmDelete(opex)" class="text-green-600 hover:text-green-900">
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
            Are you sure you want to delete this OPEX? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button @click="showDeleteModal = false" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Cancel
            </button>
            <button @click="deleteOpex" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
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
import axios from 'axios'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { RouterLink, useRouter } from 'vue-router'
import { 
  GetOpex,
  DeleteOpex
} from '@/core/utils/url_api'
import ApiServices from '@/core/services/ApiServices'

export default defineComponent({
  name: 'OPEX Cogs',
  components: {
    AdminLayout,
    RouterLink
  },
  data() {
    const router = useRouter();
    const tableHeaders = [
      { key: 'opex_code', label: 'Opex Number' },
      { key: 'opex_name', label: 'Opex Name' },
      { key: 'customer_name', label: 'Customer name' },
      { key: 'opex_price', label: 'Price' },
      { key: 'opex_type', label: 'Type' },
      { key: 'actions', label: 'Actions' },
    ];
    return {
      router: router,
      tableHeaders: tableHeaders,
      po_type: '',
      searchQuery: '',
      sortBy: 'opex_name',
      minPrice: 0,
      maxPrice: 0,
      currentPage: 1,
      itemsPerPage: 10,
      opexData: [],
      loading: false,
      showDeleteModal: false,
      opexToDelete: null,

    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const response = await ApiServices.get(GetOpex);
        this.opexData = response.data;
      } catch (error) {
        console.error('Error Fetching Opex Data:', error)
      } finally {
        this.loading = false;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },
    editOpex(opex) {
      this.router.push('/opex-cogs/edit/' + opex.opex_id)
    },
    confirmDelete(opex) {
      this.opexToDelete = opex;
      this.showDeleteModal = true;
    },
    async deleteOpex() {
      try {
        this.loading = true
        const id = this.opexToDelete.opex_id;
        // TODO: Implement API call
        await ApiServices.delete(DeleteOpex + '/' + id).then(
          async (res) => {
            await this.fetchData();
          }
        );

        this.showDeleteModal = false
        this.opexToDelete = null

        // Show success message                
      } catch (error) {
        console.error('Error deleting OPEX:', error)
        alert('Failed to delete OPEX')
      } finally {
        this.loading = false
      }
    }
  },
  computed: {
    filteredData() {
      let result = this.opexData;

      if (this.po_type === '') {
        result = result.filter(opex => opex.opex_type === 'cogs');
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        result = result.filter(
          (opex) => {
            opex.opex_name.toLowerCase().includes(query) ||
              opex.opex_code.toLowerCase().includes(query) ||
              opex.customer.customer_name.toLowerCase().includes(query)
          }
        )
      }
      if (this.minPrice) {
        result = result.filter(opex => opex.opex_price >= this.minPrice);
      }

      if (this.maxPrice) {
        result = result.filter((opex) => opex.opex_price <= this.maxPrice)
      }

      result.sort((a, b) => {
        if (this.sortBy === 'opex_price') {
          return a.opex_price - b.opex_price
        }
        return String(a[this.sortBy]).localeCompare(String(b[this.sortBy]))
      })
      return result
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage)
    },

    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },
    endIdex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.filteredData.length)
    },

    paginatedData() {
      return this.filteredData.slice(this.startIndex, this.endIdex);
    },
    displayedPages() {
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= this.totalPages; i++) {
        if (
          i === 1 ||
          i === this.totalPages ||
          (i >= this.currentPage - delta && i <= this.currentPage + delta)
        ) {
          range.push(i)
        };
      };
      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          };
        };
        rangeWithDots.push(i);
        l = i
      });

      return rangeWithDots;
    }
  }
});
</script>
<style>
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
