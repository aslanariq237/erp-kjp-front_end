<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-300">Quotation</h1>
          <p class="text-gray-400 text-sm mt-1">Others / Quotation</p>
        </div>
        <div class="flex gap-3">
          <button @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
            <span>Export</span>
          </button>
          <button>
            <RouterLink to="/quotation/form"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Add New Quotation
            </RouterLink>
          </button>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search by Quotation ID or description..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="relative overflow-x-scroll">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th v-for="header in tableHeaders" :key="header.key"
                class="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:bg-gray-800"
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
            <tr v-else-if="paginatedData.length === 0" class="text-center dark:bg-gray-800 dark:text-gray-400">
              <td colspan="5" class="px-6 py-4">No data found</td>
            </tr>
            <tr v-for="(entry, index) in paginatedData" :key="entry.id"
              class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800">
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ entry.code_quatation }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                {{ entry.customer.customer_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatCurrency(entry.sub_total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatCurrency(entry.ppn) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ formatCurrency(entry.grand_total) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {{ entry.issue_at }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                <button @click="viewData(entry.id_quatation)" class="mx-2 px-3 py-2 rounded-lg shadow-lg border">
                  View
                </button>
                <button @click="editData(entry.id_quatation)" class="shadow-lg mr-2 px-3 py-2 rounded-lg border">
                  Edit
                </button>
                <button @click="deleteData(entry.id_quatation)" class="shadow-lg mr-2 px-3 py-2 rounded-lg border">
                  Delete
                </button>
                <button @click="editPPN(entry)" class="shadow-lg mr-2 px-3 py-2 rounded-lg border">
                  Edit PPN
                </button>
                <button @click="exportToPDF(entry)" class="shadow-lg px-3 py-2 rounded-lg border">
                  Pdf
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
          class="bg-white px-6 py-4 border-t border-gray-200 dark:bg-gray-800 dark:text-gray-400"
        >
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-400">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIdex }}</span>
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
                  class="pagination-button px-1 rounded-md"
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
  </AdminLayout>
</template>
<script>
import { defineComponent } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ApiServices from '@/core/services/ApiServices';
import router from '@/router';
import { exportQuoPDF } from '@/core/helpers/exportToPdf'
import { 
  DetailQuatation, 
  Quatations, 
  QuatationsAdd, 
  QuatationsDelete 
} from '@/core/utils/url_api'
import Swal from 'sweetalert2';

export default defineComponent({
  components: {
    AdminLayout,
  },
  data() {
    const tableHeaders = [
      { key: 'code_quatation', label: 'Quotation' },
      { key: 'customer', label: 'Customer' },
      { key: 'sub_total', label: 'Sub Total' },
      { key: 'sub_total', label: 'PPN' },
      { key: 'sub_total', label: 'Amount' },
      { key: 'issue_at', label: 'Date' },
      { key: 'action', label: 'Action' },
    ]
    return {
      tableHeaders,
      searchQuery: '',
      itemsPerPage: 10,
      currentPage: 1,
      loading: false,
      quotations: [],
      dataexcel: [],
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      await ApiServices.get(Quatations).then((res) => {
        var data = res.data;
        this.quotations = data;
      });
    },
    viewData(id) {
      router.push('/quotation/view/' + id)
    },
    editData(id) {
      router.push('/quotation/edit/' + id)
    },
    async deleteData(id){
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
          await ApiServices.delete(QuatationsDelete + '/' + id)
          await Quatation()
          Swal.fire('Deleted!', 'The quotation has been deleted.', 'success')
        } catch (error) {
          Swal.fire('Error!', 'There was an error deleting the quotation.', 'error')
        }
      }
    },

    editPPN(item) {
      ApiServices.post(QuatationsAdd + '/edit-ppn/' + item.id_quatation, {
        sub_total: item.sub_total,
        ppn: item.ppn,
      }).then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil Edit PPN'
        }).then(async (res) => {
          if (res.isConfirmed) {
            await this.getData();
          }
        })
      }).catch((err) => console.error(err));
    },

    exportToPDF(item){
      exportQuoPDF(item);
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR'
      }).format(value);
    },


    exportData() {
      ApiServices.get(DetailQuatation).then((res) => {
        var data = res.data;
        this.dataexcel = data;
      }).then((res) => {
        const data = this.dataexcel.map((entry) => ({
          'Quotation Number': entry.quo.code_quatation,
          'Customer': entry.quo.customer.customer_name,
          'Product Desc': entry.product.product_desc,
          'Product SN': entry.product.product_sn,
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
      })
    }
  },
  computed: {
    filteredData() {
      let result = this.quotations;

      result.sort((a, b) => new Date(b.issu_at) - new Date(a.issue_at));

      if (this.searchQuery) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => {
          const code_quatation = entry.code_quatation.toLowerCase()
          const customer = entry.customer.customer_name.toLowerCase()
          return code_quatation.includes(query) || customer.includes(query)
        })
      }
      return result;
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
    },
  }
});
</script>