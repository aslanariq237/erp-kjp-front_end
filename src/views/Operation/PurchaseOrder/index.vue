<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Purchase Order</h1>
          <p class="text-gray-500 text-sm mt-1">SCM / Purchase Order</p>
        </div>
        <div class="flex gap-3">
          <button>
            <RouterLink
              to="/purchase-order/form"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add New Purchase Order
            </RouterLink>
          </button>
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
                v-model="startDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                v-model="endDate"
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
              <tr class="dark:bg-gray-800 dark:text-gray-400">
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
              <tr v-if="loading" class="text-center dark:bg-gray-800 dark:text-gray-400">
                <td colspan="14" class="px-6 py-4">Loading...</td>
              </tr>
              <tr v-else-if="paginatedData.length === 0" class="text-center dark:bg-gray-800 dark:text-gray-400">
                <td colspan="14" class="px-6 py-4">No data found</td>
              </tr>
              <tr
                v-for="(entry, index) in paginatedData"
                :key="entry.id_po"
                class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400"
              >                
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ entry.code_po }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ entry.vendor.vendor_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(entry.sub_total) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(entry.sub_total * 0.11) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatCurrency(entry.sub_total * 0.11 + entry.sub_total) }}
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
                    @click="viewData(entry.id_po)"
                  >
                    View
                  </button>
                  <button
                    class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                    @click="viewData(entry.id_invoice)"
                  >
                    Edit
                  </button>
                  <button class="shadow-lg mr-2 px-3 py-2 rounded-lg" @click="exportToPDF(entry)">
                    Export
                  </button>
                  <button
                    class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                    @click="viewData(entry.id_invoice)"
                  >
                    Approve
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
import purchase_pdf from '@/components/templates/pdf/purchase_pdf.vue'
import { PurchaseOrder } from '@/core/utils/url_api'
import router from '@/router'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default defineComponent({
  name: 'PurchaseOrderPage',
  components: {
    AdminLayout,
  },

  setup() {
    const loading = ref(false)

    // Table headers configuration
    const tableHeaders = [
      { key: 'code_po', label: 'Po Number' },
      { key: 'code_po', label: 'Vendor name' },
      { key: 'sub_total', label: 'Sub Total' },
      { key: 'sub_total', label: 'PPn' },
      { key: 'sub_total', label: 'Grand Total' },
      { key: 'issue_at', label: 'Issue Date' },
      { key: 'due_at', label: 'Due Date' },
      { key: 'Action', label: 'Action' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('code_po')
    const startDate = ref('')
    const endDate = ref('')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Sample data - replace with API call
    const entries = ref([])

    const getPurchaseOrder = async () => {
      try {
        const res = await axios.get(PurchaseOrder)
        entries.value = res.data
      } catch (error) {
        console.error('Error Fetching : ', error)
      }
    }
    onMounted(() => {
      getPurchaseOrder()
    })

    const viewData = (id) => {
      router.push('/purchase-order/view/' + id)
    }

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...entries.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter((entry) => entry.code_po.toLowerCase().includes(query))
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
    const exportData = () => {
      const data = filteredData.value.map((entry) => ({
        'Code PO': entry.code_po,
        'PO Type': entry.po_type,
        'Status Payment': entry.status_payment,
        'Sub Total': entry.sub_total,
        'Total Tax': entry.total_tax,
        'Total Service': entry.total_service,
        Deposit: entry.deposit,
        PPN: entry.ppn,
        'Grand Total': entry.grand_total,
        'Issue Date': entry.issue_at,
        'Due Date': entry.due_at,
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
      a.setAttribute('download', `purchase-order-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }
    const exportToPDF = (item) => {
      // Buat instance Vue baru untuk merender komponen
      const container =  document.createElement('div')
      document.body.appendChild(container)
      const app = createApp({
        render : () => h(purchase_pdf, {item})
      });

      const instance = app.mount(container);

      // Gunakan html2canvas untuk mengonversi elemen ke gambar
      html2canvas(instance.$el).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Tambahkan gambar ke PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Simpan PDF
        pdf.save(`purchase_order_${item.code_po}.pdf`);
      });
    }
    // const exportToPDF = (entry) => {
    //   const doc = new jsPDF()
    //   const pageWidth = doc.internal.pageSize.width
    //   const margin = 20
    //   const tableWidth = pageWidth - margin * 2

    //   // Helper function to draw table row
    //   const drawTableRow = (columns, y, isHeader = false) => {
    //     const colWidths = [0.25, 0.35, 0.2, 0.2] // Proportions of table width
    //     let x = margin

    //     // Background for header
    //     if (isHeader) {
    //       doc.setFillColor(240, 240, 240)
    //       doc.rect(margin, y - 6, tableWidth, 10, 'F')
    //       doc.setFont('helvetica', 'bold')
    //     } else {
    //       doc.setFont('helvetica', 'normal')
    //     }

    //     // Draw cell content
    //     columns.forEach((text, i) => {
    //       const cellWidth = tableWidth * colWidths[i]
    //       doc.text(text || '', x, y)
    //       x += cellWidth
    //     })

    //     return y + 10 // Return next line position
    //   }

    //   // Header with logo and company info
    //   doc.setFontSize(16)
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('DARSA MIGUNA INTERNATIONAL', margin, 20)

    //   doc.setFontSize(10)
    //   doc.setFont('helvetica', 'normal')
    //   doc.text('Jl. Mampang Prapatan Raya 15, No. 73A', pageWidth - margin, 15, { align: 'right' })
    //   doc.text('Tegal Parang, Mampang Prapatan, Jakarta 12790', pageWidth - margin, 20, {
    //     align: 'right',
    //   })
    //   doc.text('admin@darsainternational.co.id', pageWidth - margin, 25, { align: 'right' })
    //   doc.text('(021)87909871', pageWidth - margin, 30, { align: 'right' })

    //   // Line separator
    //   doc.line(margin, 35, pageWidth - margin, 35)

    //   // Quotation title
    //   doc.setFontSize(14)
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('QUOTATION', pageWidth / 2, 45, { align: 'center' })

    //   // Quotation info in a table format
    //   doc.setFontSize(10)
    //   let y = 60

    //   // Customer info
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('Customer Information:', margin, y)
    //   y += 10

    //   const customerTable = [
    //     ['Vendor', ':', entry.vendor.vendor_name, ''],
    //     ['PO Type', ':', entry.po_type, ''],
    //     ['Status Payment', ':', entry.status_payment, ''],
    //     ['Sub Total', ':', formatCurrency(entry.sub_total)],
    //     ['Total Tax', ':', formatCurrency(entry.total_tax)],
    //     ['Total Service', ':', formatCurrency(entry.total_service)],
    //     ['Deposit', ':', formatCurrency(entry.deposit)],
    //     ['PPN', ':', formatCurrency(entry.ppn)],
    //     ['Grand Total', ':', formatCurrency(entry.grand_total)],
    //     ['Issue Date', ':', entry.issue_at],
    //     ['Due Date', ':', entry.due_at],
    //   ]

    //   // Draw customer info table
    //   customerTable.forEach((row) => {
    //     doc.setFont('helvetica', 'bold')
    //     doc.text(row[0] || '', margin, y)
    //     doc.setFont('helvetica', 'normal')
    //     doc.text(row[1] || '', margin + 35, y)
    //     doc.text(row[2] || '', margin + 40, y)
    //     y += 8
    //   })

    //   y += 15

    //   // Items table header
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('Quotation Details:', margin, y)
    //   y += 10

    //   // Draw table border
    //   doc.rect(margin, y - 6, tableWidth, 10 + (entry.items?.length || 3) * 10, 'S')

    //   // Table header
    //   y = drawTableRow(['Item', 'Description', 'Quantity', 'Price'], y, true)

    //   // Draw horizontal line after header
    //   doc.line(margin, y - 6, pageWidth - margin, y - 6)

    //   // Table content
    //   if (entry.items && entry.items.length > 0) {
    //     entry.items.forEach((item, index) => {
    //       const itemNo = item.code || `${index + 1}`
    //       const desc = item.name || item.description || '-'
    //       const qty = `${item.qty} ${item.unit || 'Pcs'}`
    //       const price = formatCurrency(item.price)

    //       y = drawTableRow([itemNo, desc, qty, price], y)

    //       // Draw horizontal line between rows
    //       doc.line(margin, y - 6, pageWidth - margin, y - 6)
    //     })
    //   } else {
    //     // Example items if no data
    //     ;[
    //       ['45-SW-041-001', 'WATER PUMP A650', '1 PL', 'Rp -'],
    //       ['45-SW-041-002', 'WATER PUMP PV400', '1 PL', 'Rp -'],
    //       ['45-SW-041-003', 'WATER PUMP PV500', '1 PL', 'Rp -'],
    //     ].forEach((row) => {
    //       y = drawTableRow(row, y)

    //       // Draw horizontal line between rows
    //       doc.line(margin, y - 6, pageWidth - margin, y - 6)
    //     })
    //   }

    //   // Draw vertical lines for columns
    //   let colX = margin
    //   const colWidths = [0.25, 0.35, 0.2, 0.2] // Same proportions as in drawTableRow

    //   colWidths.forEach((width, i) => {
    //     if (i < colWidths.length - 1) {
    //       colX += tableWidth * width
    //       doc.line(colX, y - 6 - (entry.items?.length || 3) * 10 - 10, colX, y - 6)
    //     }
    //   })

    //   y += 15

    //   // Total information table
    //   const totalTable = [
    //     ['Subtotal', ':', formatCurrency(entry.sub_total || 0)],
    //     ['Tax', ':', formatCurrency(entry.total_tax || 0)],
    //     ['TOTAL', ':', formatCurrency(entry.grand_total || entry.sub_total || 0)],
    //   ]

    //   // Draw total info right-aligned
    //   totalTable.forEach((row, index) => {
    //     const labelX = pageWidth - margin - 80
    //     const colonX = pageWidth - margin - 30
    //     const valueX = pageWidth - margin

    //     if (index === 2) {
    //       doc.setFont('helvetica', 'bold') // Make the total line bold
    //     } else {
    //       doc.setFont('helvetica', 'normal')
    //     }

    //     doc.text(row[0] || '', labelX, y)
    //     doc.text(row[1] || '', colonX, y)
    //     doc.text(row[2] || '', valueX, y, { align: 'right' })

    //     y += 8
    //   })

    //   y += 15

    //   // Payment terms
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('Terms of Payment:', margin, y)
    //   y += 8

    //   doc.setFont('helvetica', 'normal')
    //   doc.text(entry.termin || 'Payment due within 30 days after delivery', margin, y)

    //   y += 20

    //   // Notes section
    //   doc.setFont('helvetica', 'bold')
    //   doc.text('Note:', margin, y)
    //   y += 8

    //   doc.setFont('helvetica', 'normal')
    //   doc.text('- Delivery time: READY 3 WEEKS AFTER PO', margin, y)
    //   y += 8
    //   doc.text('- Prices are valid for 7 days from quotation date', margin, y)
    //   y += 8
    //   doc.text(
    //     '- If you have any questions concerning this quotation, please contact us',
    //     margin,
    //     y,
    //   )

    //   y += 20

    //   // Signature
    //   doc.text('Yours Sincerely,', margin, y)
    //   y += 30

    //   doc.line(margin, y, margin + 50, y)
    //   y += 8
    //   doc.text('(                                 )', margin, y)

    //   // Footer
    //   const footerY = doc.internal.pageSize.height - 20
    //   doc.setFontSize(8)
    //   doc.text('THANK YOU FOR YOUR BUSINESS!', pageWidth / 2, footerY, { align: 'center' })

    //   // Save the PDF
    //   doc.save(`purchaseorder-${entry.code_po}.pdf`)
    // }

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    }

    const numberWithCommas = (x) => {
      var x = x.toString().replace(".", ",");
    
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return {
      viewData,
      // State
      loading,
      searchQuery,
      sortBy,
      startDate,
      endDate,
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
      exportData,
      exportToPDF,
      formatCurrency,
      numberWithCommas,
    }
  },
})
</script>
<style scoped>
.pagination-button {
  @apply px-3 py-1 border border-gray-300 dark:text-gray-400 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1 dark:text-gray-400;
}

.form-group input,
.form-group select {
  @apply block w-full dark:bg-gray-800 dark:text-gray-400 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}
</style>
