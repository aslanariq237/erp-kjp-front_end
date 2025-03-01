<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Invoice</h1>
          <p class="text-gray-500 text-sm mt-1">Others / Invoice</p>
        </div>
        <div class="flex gap-3 items-center">          
          <RouterLink
            to="/invoice/form"
            class="bg-blue-500 px-6 py-2 rounded-lg"
          >
          Add New Data
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
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"                
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
        <tr>
          <th v-for="header in tableHeaders" :key="header.key" @click="sortTable(header.key)">
            <div class="flex items-center gap-2">
              {{ header.label }}
              <span v-if="sortBy === header.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="order in paginatedOrders" :key="order.code_so" class="hover:bg-gray-50 transition-colors duration-150">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.code_so }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.customer.customer_name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.employee.employee_name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.termin }}</td>          
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.status_payment }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.sub_total }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.deposit }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.ppn }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.grand_total }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.issue_at }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.due_at }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button class="bg-yellow-300">Edit</button>
            <button class="bg-red-300">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
        </div>

        <!-- Enhanced Pagination -->
        <div class="bg-white px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">            
            <!-- <div class="flex items-center space-x-2">
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
            </div> -->
          </div>
        </div>
      </div>
    </div>    
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { SalesOrder } from '@/core/utils/url_api';
import axios from 'axios';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    AdminLayout
  },
  data() {
    return {
      orders: [],
      tableHeaders: [
        { key: 'code_so', label: 'Code SO' },
        { key: 'customer_id', label: 'Customer ID' },
        { key: 'employee_id', label: 'Employee ID' },
        { key: 'termin', label: 'Termin' },
        { key: 'total_tax', label: 'Total Tax' },
        { key: 'status_payment', label: 'Status Payment' },        
        { key: 'deposit', label: 'Deposit' },
        { key: 'ppn', label: 'PPN' },
        { key: 'grand_total', label: 'Grand Total' },
        { key: 'issue_at', label: 'Issue At' },
        { key: 'due_at', label: 'Due At' },
        { key: 'Action', label: 'Action' },       
      ],
      sortBy: '',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    sortedOrders() {
      return this.orders.sort((a, b) => {
        let modifier = this.sortOrder === 'asc' ? 1 : -1;
        if (a[this.sortBy] < b[this.sortBy]) return -1 * modifier;
        if (a[this.sortBy] > b[this.sortBy]) return 1 * modifier;
        return 0;
      });
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.sortedOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.orders.length / this.pageSize);
    }
  },
  async mounted() {
    this.getSalesOrder();
  },
  methods: {
    async getSalesOrder() {
      try {
        const res = await axios.get(SalesOrder);
        this.orders = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    sortTable(key) {
      if (this.sortBy === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = key;
        this.sortOrder = 'asc';
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
});
</script>