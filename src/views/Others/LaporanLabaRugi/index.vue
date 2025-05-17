<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Laporan Keuangan</h1>
          <p class="text-gray-500 text-sm mt-1">Finance Tools/ Laporan Keuangan</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="exportToExcel"
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
            <label class="text-sm font-medium text-gray-600 mb-2 block">Cari</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari berdasarkan nama atau akun..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
            </div>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Rentang Saldo</label>
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
            <label class="text-sm font-medium text-gray-600 mb-2 block">Urutkan Berdasarkan</label>
            <select
              v-model="sortBy"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Nama</option>
              <option value="balance">Saldo</option>
              <option value="accountNumber">Nomor Akun</option>
              <option value="date">Tanggal Dibuat</option>
            </select>
          </div>
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Item per halaman</label>
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
                <td colspan="42" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center">
                <td colspan="42" class="px-6 py-4">Tidak ada data</td>
              </tr>
              <tr
                v-for="(entry, index) in paginatedData"
                :key="entry.id_po"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <!-- Po Number -->                                                    
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.po_number }}
                </td>                                                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.customer_code }}
                </td>               
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.customer_name }}
                </td>               
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.product_sn }}
                </td>        
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.product_desc }}
                </td>          
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.quantity_so }}
                </td>            
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.price_so }}
                </td>              
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.amount_so }}
                </td>               
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.brand }}
                </td>                   
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.code_so }}
                </td>                 
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.so_date }}
                </td>             
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.quantity_po }}
                </td>             
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.price_po }}
                </td>              
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.amount_po }}
                </td>               
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.delivery_order }}
                </td>  
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.do_date }}
                </td>             
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.qty_do }}
                </td>            
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.bill_no }}
                </td>             
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.billing_date }}
                </td>                  
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.amount_invoice }}
                </td>                    
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.gross_profit }}
                </td>                  
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.gp_percentage }}
                </td>                   
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.faktur_pajak }}
                </td>                  
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.faktur_date }}
                </td>                 
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.tanda_terima_invoice }}
                </td>                          
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.tanda_terima_invoice_date }}
                </td>                                                                                                     
              </tr>              
            </tbody>
          </table>
        </div>

        <!-- Enhanced Pagination -->
        <div class="bg-white px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Menampilkan
              <span class="font-medium">{{ startIndex + 1 }}</span>
              sampai
              <span class="font-medium">{{ endIndex }}</span>
              dari
              <span class="font-medium">{{ filteredData.length }}</span>
              hasil
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="currentPage = 1"
                :disabled="currentPage === 1"
                class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Pertama
              </button>
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                Sebelumnya
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
                Berikutnya
              </button>
              <button
                @click="currentPage = totalPages"
                :disabled="currentPage >= totalPages"
                class="pagination-button"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
              >
                Terakhir
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
          <h3 class="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
          <p class="mb-6">
            Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Batal
            </button>
            <button
              @click="deleteAccount"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Hapus
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
import { GetReportManagement } from '@/core/utils/url_api'
import axios from 'axios'

export default defineComponent({
  name: 'LaporanKeuanganPage',
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
      { key: 'po_number', label: 'Po Number' }, // po sales order      
      { key: 'cust_code', label: 'Customer Code' }, //customer code
      { key: 'cust_name', label: 'Customer Name' }, // customer name
      { key: 'pn', label: 'PN' }, // part number product
      { key: 'desc', label: 'Product Desc' }, //name product
      { key: 'qty_so', label: 'Quantity SO' }, //quantity sales order
      { key: 'price_so', label: 'Price So' }, //price per unit sales order
      { key: 'amount_so', label: 'Amount So' }, //amount sales order
      { key: 'brand', label: 'Brand' }, // brand product
      { key: 'sales_order', label: 'SO Number' }, // sales order code
      { key: 'sales_order_date', label: 'So Date' }, // sales order date
      { key: 'qty_po', label: 'Quantity PO' }, // quantity purchase order
      { key: 'price_po', label: 'Price PO' }, // price per unit purchase order
      { key: 'amount_po', label: 'Amount PO' }, // amount purchase order
      { key: 'do_number', label: 'DO Number' }, // amount purchase order      
      { key: 'delivery_order_date', label: 'DO Date' }, // delivery order date
      { key: 'qty_do', label: 'Quantity DO' }, //quantity delivery order
      // { key: 'qty_do', label: 'DO Date' }, //delivery order date
      { key: 'bill_no', label: 'BILL NO' }, // invoice number
      // last in here
      { key: 'billing_date', label: 'BILLING DATE' },
      { key: 'amount_invoice', label: 'AMOUNT INVOICE' },
      { key: 'gross_profit', label: 'GROSS PROFIT' },
      { key: 'gp_percentage', label: '% GP' },
      { key: 'faktur_pajak', label: 'FAKTUR PAJAK' },
      { key: 'faktur_date', label: 'FAKTUR DATE' },
      { key: 'tanda_terima_invoice', label: 'TANDA TERIMA INVOICE' },
      { key: 'tanda_terima_invoice_date', label: 'TANDA TERIMA INVOICE DATE' },      
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('po_number')
    const minBalance = ref('')
    const maxBalance = ref('')
    const currentPage = ref(1)
    const reportManagement = ref([])
    const itemsPerPage = ref(10)

    // Sample data
    const accounts = ref([])

    const GetReport = async () => {
      loading.value = true
      try {
        // Simulate API call
        const response = await axios.get(GetReportManagement)        
        reportManagement.value = response.data                
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      GetReport()   
      console.log(reportManagement)   
    })

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...reportManagement.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (reportManagement) =>
            reportManagement.po_number.toLowerCase().includes(query) ||
            reportManagement.cust_name.toLowerCase().includes(query),
        )
      }      

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

    const exportToExcel = () => {
      const data = filteredData.value.map((entry) => {
        return {
          'Po Number': entry.po_code,
          'Customer Code': entry.cust_code,
          'Customer Name': entry.cust_name,
          PN: entry.pn,
          'Product Desc': entry.desc,
          'Quantity SO': entry.qty_so,
          'Price SO': entry.price_so,
          'Amount SO': entry.amount_so,
          'SO Number': entry.sales_order,
          'SO Date': entry.sales_order_date,
          'Quantity PO': entry.qty_po,
          'Price PO': entry.price_po,
          'Amount PO': entry.amount_po,
          Brand: entry.product_brand,
          'DO Number': entry.delivery_order,
          'DO Date': entry.do_date,
          'Quantity DO': entry.qty_do,
          'Outstanding Supply': entry.qty_so - entry.qty_po,
          'Invoice Number': entry.bill_no,
          'Invoice Date': entry.billing_date,
          'Amount Invoice': entry.amount_invoice,
          'Gross Profit': entry.gross_profit,
          '% GP': entry.gp_percentage,
          //last
          'FAKTUR PAJAK': entry.faktur_pajak,
          'FAKTUR DATE': entry.faktur_date,
          'TANDA TERIMA INVOICE': entry.tanda_terima_invoice,
          'TANDA TERIMA INVOICE DATE': entry.tanda_terima_invoice_date,
          RESI: entry.resi,
          DITERIMA: entry.diterima,
          'RECEIVED DATE': entry.received_date,
          'STATUS AR': entry.status_ar,
          'TOTAL AR': entry.total_ar,
          'AGING AR': entry.aging_ar,
          PAYMENT1: entry.payment1,
          'PAYMENT NUMBER': entry.payment_number,
          'PAYMENT1 DATE': entry.payment1_date,
          'OS AR': entry.os_ar,
        }
      })

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
      a.setAttribute('download', `Laporan Keuangan -${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
    // Utility functions
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    }

    return {
      // State
      loading,
      showDeleteModal,
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
      exportToExcel,
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
