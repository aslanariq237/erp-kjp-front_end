<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Invoice</h1>
          <p class="text-gray-500 text-sm mt-1">Others / Invoice</p>
        </div>
        <div class="flex gap-3 items-center">
          <button
            @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <span>Export</span>
          </button>
          <RouterLink to="/invoice/form" class="bg-blue-500 px-6 py-2 rounded-lg text-white">
            Add New Invoice
          </RouterLink>
        </div>
      </div>

      <!-- Enhanced Filter Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="form-group">
            <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by code..."
                class="w-full pl-10 pr-3 py-2 border dark:bg-gray-800 dark:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                v-model="startDate"
                class="w-full px-3 py-2 border dark:bg-gray-800 dark:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                v-model="endDate"
                class="w-full px-3 py-2 border dark:bg-gray-800 dark:text-gray-400 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Table Section -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 ">
            <thead class="bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
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
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:text-gray-400">
              <tr v-if="loading" class="text-center">
                <td colspan="14" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center dark:bg-gray-800 dark:text-gray-400">
                <td colspan="14" class="px-6 py-4">No data found</td>
              </tr>
              <tr
                v-for="(entry, index) in paginatedData"
                :key="entry.id_invoice"
                class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400"
              >                                
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.code_invoice }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.salesorder.po_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.customer.customer_name }}
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
                  <button
                    class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                    @click="viewData(entry.id_invoice)"
                  >
                    View
                  </button>
                  <button
                    class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                    @click="editData(entry.id_invoice)"
                  >
                    Edit
                  </button>
                  <button class="shadow-lg mr-2 px-3 py-2 rounded-lg" @click="exportToPDF(entry)">
                    Export
                  </button>                  
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
    </div>
  </AdminLayout>
</template>

<script>
import { defineComponent, ref, computed, onMounted, createApp, h } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import axios from 'axios'
import { Invoice, InvoiceAdd, SalesOrders } from '@/core/utils/url_api'
import InvoicePdfTemplate from '@/components/templates/pdf/invoice_pdf.vue'
import router from '@/router'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { exportInvPDF } from '@/core/helpers/exportToPdf'

export default defineComponent({
  name: 'InvoicePage',
  components: {
    AdminLayout,
  },

  setup() {
    const loading = ref(false)

    // Table headers configuration
    const tableHeaders = [
      { key: 'code_invoice', label: 'Invoice Number' },
      { key: 'code_po', label: 'Po Number' },
      { key: 'Customer', label: 'Customer Name' },
      { key: 'sub_total', label: 'Sub Total' },
      { key: 'issue_at', label: 'Issue Date' },
      { key: 'due_at', label: 'Due Date' },
      { key: 'action', label: 'Action' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('code_invoice')
    const startDate = ref('')
    const endDate = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)
    const invoice = ref([])
    const purchaseorders = ref([])

    const getInvoices = async () => {
      const response = await axios.get(Invoice)
      invoice.value = response.data

      if (invoice.value.length > 0) {
        const invoiceId = invoice.value[0].id_transaksi // Assuming 'id_transaksi' is the ID to use
        getById(invoiceId)
      }
    }
    const approved = (id) => {
      axios.post(InvoiceAdd + '/appr/' + id).then((res) => {
        console.log(res);
      })
    }

    const viewData = (id) => {
      router.push('/invoice/view/' + id)
    }
    const editData = (id) => {
      router.push('/invoice/edit/' + id);
    }

    const getById = async () => {
      const res = await axios.get(SalesOrders)
      purchaseorders.value = res.data
    }

    onMounted(() => {
      getInvoices()
    })
    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...invoice.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => {
          const code_inv = entry.code_invoice.toLowerCase()
          const po_number = entry.salesorder.po_number.toLowerCase()
          const customer = entry.customer.customer_name.toLowerCase()
          return code_inv.includes(query)||
                po_number.includes(query) ||
                customer.includes(query)
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

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
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

    // Utility functions
    const exportData = () => {
      const data = filteredData.value.map((entry) => ({
        'Code Invoice': entry.code_invoice,
        'Invoice Type': entry.invoice_type,
        'Status Payment': entry.status_payment,
        'Sub Total': entry.sub_total,
        'Total Tax': entry.total_tax,
        'Total Service': entry.total_service,
        Deposit: entry.deposit,
        PPN: entry.ppn,
        'Grand Total': entry.grand_total,
        'Issue Date': entry.issue_at,
        'Due Date': entry.due_at,
        'Customer Name': entry.customer.customer_name,
        'PO Number': entry.code_po,
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
      a.setAttribute('download', `invoice-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    const exportToPDF = (item) => {
      exportInvPDF(item);
    }
    // const exportToPDF = (entry) => {
    //   const doc = new jsPDF()
    //   const pageWidth = doc.internal.pageSize.width

    //   // Header
    //   doc.setFontSize(12)
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('DMI', 10, 15)
    //   doc.setFontSize(8)
    //   doc.text('DARSA', 10, 20)
    //   doc.text('MIZUNA', 10, 24)
    //   doc.text('INTERNATIONAL', 10, 28)

    //   // Contact info - right aligned
    //   doc.setFont('helvetica', 'normal')
    //   doc.text('E: Mizuna@Propunica Raya 14, No. 23A', pageWidth - 10, 15, { align: 'right' })
    //   doc.text('Telp/Fax: +6221-626-6799', pageWidth - 10, 19, { align: 'right' })
    //   doc.text('www.dmizuna.co.id', pageWidth - 10, 23, { align: 'right' })
    //   doc.text('info@dmizuna.co.id', pageWidth - 10, 27, { align: 'right' })

    //   // Invoice title
    //   doc.setFontSize(14)
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('INVOICE', pageWidth / 2, 40, { align: 'center' })

    //   // Invoice details - left side
    //   doc.setFontSize(9)
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('Invoice To:', 10, 50)
    //   doc.setFont('helvetica', 'normal')
    //   doc.text(`${entry.customer.customer_name}`, 10, 55)
    //   doc.text(`${entry.customer.address || ''}`, 10, 60)
    //   doc.text(`${entry.customer.city || ''}, ${entry.customer.province || ''}`, 10, 65)

    //   // Invoice details - right side
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('Tax Invoice Order No', pageWidth - 60, 50)
    //   doc.text('Invoice No', pageWidth - 60, 55)
    //   doc.text('PO Number', pageWidth - 60, 60)
    //   doc.text('Terms of Payment', pageWidth - 60, 65)
    //   doc.text('Valid Days', pageWidth - 60, 70)

    //   doc.setFont('helvetica', 'normal')
    //   doc.text(`: ${entry.code_invoice}`, pageWidth - 10, 50, { align: 'right' })
    //   doc.text(`: ${entry.invoice_number || entry.code_invoice}`, pageWidth - 10, 55, {
    //     align: 'right',
    //   })
    //   doc.text(`: ${entry.po_number || '-'}`, pageWidth - 10, 60, { align: 'right' })
    //   doc.text(`: ${entry.payment_terms || '30 days'}`, pageWidth - 10, 65, { align: 'right' })
    //   doc.text(`: ${entry.valid_days || '30 days'}`, pageWidth - 10, 70, { align: 'right' })

    //   // Table header
    //   doc.setFillColor(220, 220, 220)
    //   doc.rect(10, 80, pageWidth - 20, 7, 'F')
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('Item Number', 12, 85)
    //   doc.text('Description', 45, 85)
    //   doc.text('Qty', 120, 85)
    //   doc.text('Unit', 135, 85)
    //   doc.text('Price', 150, 85)
    //   doc.text('Amount', 170, 85)
    //   doc.text('Remarks', 190, 85)

    //   // Table items
    //   let y = 95
    //   if (entry.items && entry.items.length > 0) {
    //     entry.items.forEach((item, index) => {
    //       doc.setFont('helvetica', 'normal')
    //       doc.text(`${item.item_number || index + 1}`, 12, y)
    //       doc.text(`${item.description || ''}`, 45, y)
    //       doc.text(`${item.quantity || ''}`, 120, y)
    //       doc.text(`${item.unit || ''}`, 135, y)
    //       doc.text(`${formatCurrency(item.price) || ''}`, 150, y)
    //       doc.text(`${formatCurrency(item.amount) || ''}`, 170, y)
    //       doc.text(`${item.remarks || ''}`, 190, y)
    //       y += 10
    //     })
    //   }

    //   // Totals section
    //   y = Math.max(y, 140)
    //   doc.setFillColor(220, 220, 220)
    //   doc.rect(10, y, pageWidth - 20, 7, 'F')
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('CALCULATION', 12, y + 5)

    //   y += 15
    //   doc.setFont('helvetica', 'normal')
    //   doc.text('Bank Name', 12, y)
    //   doc.text(`: ${entry.bank_name || 'Bank Mandiri KCP Jakarta Belgravia'}`, 50, y)
    //   doc.text('Operation/Referral', 120, y)
    //   doc.text(`: ${entry.operation_ref || '-'}`, 170, y)

    //   y += 7
    //   doc.text('Bank Account', 12, y)
    //   doc.text(`: ${entry.bank_account || 'PT Darsa Mizuna International'}`, 50, y)
    //   doc.text('Discount', 120, y)
    //   doc.text(`: ${formatCurrency(entry.discount) || '-'}`, 170, y)

    //   y += 7
    //   doc.text('Account No.', 12, y)
    //   doc.text(`: ${entry.account_number || '120-00-9923453'}`, 50, y)
    //   doc.text('Tax 11%', 120, y)
    //   doc.text(`: ${formatCurrency(entry.ppn) || '-'}`, 170, y)

    //   y += 7
    //   doc.setLineWidth(0.1)
    //   doc.line(120, y, pageWidth - 10, y)

    //   y += 7
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('TOTAL', 120, y)
    //   doc.text(`: ${formatCurrency(entry.grand_total) || '-'}`, 170, y)

    //   // Footer note
    //   y += 20
    //   doc.setFont('helvetica', 'normal')
    //   doc.setFontSize(8)
    //   doc.text('If you have any questions concerning this invoice please contact us:', 10, y)
    //   doc.text('Telp: +62 21 6266 7799, Fax: 6266 9966', 10, y + 5)
    //   doc.text('Thank you for your business', 10, y + 10)

    //   // Signature
    //   y += 25
    //   doc.text('Authorized Signature', 10, y)

    //   doc.save(`invoice-${entry.code_invoice}.pdf`)
    // }

    return {
      viewData,
      editData,
      approved,
      // State
      loading,
      searchQuery,
      sortBy,
      startDate,
      endDate,
      currentPage,
      itemsPerPage,
      tableHeaders,

      //data
      purchase_order_id: null,

      // Computed
      filteredData,
      paginatedData,
      totalPages,
      startIndex,
      endIndex,
      displayedPages,
      invoice: [],

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
  @apply px-3 py-1 border dark:bg-gray-800 dark:text-gray-400 border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.form-group label {
  @apply block text-sm  dark:text-gray-400 font-medium text-gray-700 mb-1;
}

.form-group input,
.form-group select {
  @apply block w-full  dark:text-gray-400 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>
