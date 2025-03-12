<template>
  <AdminLayout>
    <div class="container mx-auto px-6 py-4">
      <!-- Header Section with Enhanced Styling -->
      <div class="flex justify-between items-center mb-6">
        <div class="breadcrumb">
          <h1 class="text-2xl font-bold text-gray-800">Quotation</h1>
          <p class="text-gray-500 text-sm mt-1">Others / Quotation</p>
        </div>
        <div class="flex gap-3">
          <button
            @click="exportData"
            class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <span>Export</span>
          </button>
          <button>
            <RouterLink
              to="/quotation/form"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add New Quotation
            </RouterLink>
          </button>
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
                placeholder="Search by Quotation ID or description..."
                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <!-- Search icon placeholder -->
                🔍
              </span>
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
                <th
                  v-for="header in tableHeaders"
                  :key="header.key"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                v-for="(entry, index) in paginatedData"
                :key="entry.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ entry.code_quatation }}
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
                  <button
                    @click="viewData(entry.id_quatation)"
                    class="mx-2 px-3 py-2 rounded-lg shadow-lg border"
                  >
                    View
                  </button>
                  <button
                    @click="editData(entry.id_quatation)"
                    class="shadow-lg mr-2 px-3 py-2 rounded-lg border"
                  >
                    Edit
                  </button>
                  <button @click="exportToPDF(entry)" class="shadow-lg px-3 py-2 rounded-lg border">
                    Export To PDF
                  </button>
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
    </div>
  </AdminLayout>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import axios from 'axios'
import { Quatations } from '@/core/utils/url_api'
import router from '@/router'
import jsPDF from 'jspdf'

export default defineComponent({
  name: 'QuotationPage',
  components: {
    AdminLayout,
  },

  setup() {
    const loading = ref(false)

    // Table headers configuration
    const tableHeaders = [
      { key: 'code_quatation', label: 'Quotation Number' },
      { key: 'customer', label: 'Customer Name' },
      { key: 'sub_total', label: 'Amount' },
      { key: 'issue_at', label: 'Date' },
      { key: 'action', label: 'Action' },
    ]

    // Filter and sort state
    const searchQuery = ref('')
    const sortBy = ref('description')
    const currentPage = ref(1)
    const itemsPerPage = ref(10)

    // Sample data - replace with API call
    const entries = ref([])

    const Quatation = async () => {
      await axios.get(Quatations).then((res) => {
        var data = res.data
        entries.value = data
      })
    }

    onMounted(() => {
      Quatation()
      console.log(entries.value)
    })

    // Computed properties for filtering and pagination
    const filteredData = computed(() => {
      let result = [...entries.value]

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (entry) =>
            entry.description.toLowerCase().includes(query) ||
            entry.id_quatation.toString().includes(query),
        )
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

    const viewData = (id) => {
      router.push('/quotation/view/' + id)
    }
    const editData = (id) => {
      router.push('/quotation/add/' + id)
    }

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

    const exportData = () => {
      const data = filteredData.value.map((entry) => ({
        code_quatation: entry.code_quatation,
        customer: entry.customer.customer_name,
        termin: entry.termin,
        sub_total: entry.sub_total,
        issue_at: entry.issue_at,
        due_at: entry.due_at,
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
      a.setAttribute('download', `quotation-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    const exportToPDF = (entry) => {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const margin = 20
      const tableWidth = pageWidth - margin * 2

      // Helper function to draw table row
      const drawTableRow = (columns, y, isHeader = false) => {
        const colWidths = [0.25, 0.35, 0.2, 0.2] // Proportions of table width
        let x = margin

        // Background for header
        if (isHeader) {
          doc.setFillColor(240, 240, 240)
          doc.rect(margin, y - 6, tableWidth, 10, 'F')
          doc.setFont('helvetica', 'bold')
        } else {
          doc.setFont('helvetica', 'normal')
        }

        // Draw cell content
        columns.forEach((text, i) => {
          const cellWidth = tableWidth * colWidths[i]
          doc.text(text, x, y)
          x += cellWidth
        })

        return y + 10 // Return next line position
      }

      // Header with logo and company info
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('DARSA MIGUNA INTERNATIONAL', margin, 20)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Jl. Mampang Prapatan Raya 15, No. 73A', pageWidth - margin, 15, { align: 'right' })
      doc.text('Tegal Parang, Mampang Prapatan, Jakarta 12790', pageWidth - margin, 20, {
        align: 'right',
      })
      doc.text('admin@darsainternational.co.id', pageWidth - margin, 25, { align: 'right' })
      doc.text('(021)87909871', pageWidth - margin, 30, { align: 'right' })

      // Line separator
      doc.line(margin, 35, pageWidth - margin, 35)

      // Quotation title
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('QUOTATION', pageWidth / 2, 45, { align: 'center' })

      // Quotation info in a table format
      doc.setFontSize(10)
      let y = 60

      // Customer info
      doc.setFont('helvetica', 'bold')
      doc.text('Customer Information:', margin, y)
      y += 10

      const customerTable = [
        ['Customer', ':', entry.customer.customer_name, ''],
        ['Quotation No', ':', entry.code_quatation, ''],
        ['Date', ':', entry.issue_at, ''],
        ['Valid Until', ':', entry.valid_to || '7 DAYS', ''],
      ]

      // Draw customer info table
      customerTable.forEach((row) => {
        doc.setFont('helvetica', 'bold')
        doc.text(row[0], margin, y)
        doc.setFont('helvetica', 'normal')
        doc.text(row[1], margin + 35, y)
        doc.text(row[2], margin + 40, y)
        y += 8
      })

      y += 15

      // Items table header
      doc.setFont('helvetica', 'bold')
      doc.text('Quotation Details:', margin, y)
      y += 10

      // Draw table border
      doc.rect(margin, y - 6, tableWidth, 10 + (entry.items?.length || 3) * 10, 'S')

      // Table header
      y = drawTableRow(['Item', 'Description', 'Quantity', 'Price'], y, true)

      // Draw horizontal line after header
      doc.line(margin, y - 6, pageWidth - margin, y - 6)

      // Table content
      if (entry.items && entry.items.length > 0) {
        entry.items.forEach((item, index) => {
          const itemNo = item.code || `${index + 1}`
          const desc = item.name || item.description || '-'
          const qty = `${item.qty} ${item.unit || 'Pcs'}`
          const price = formatCurrency(item.price)

          y = drawTableRow([itemNo, desc, qty, price], y)

          // Draw horizontal line between rows
          doc.line(margin, y - 6, pageWidth - margin, y - 6)
        })
      } else {
        // Example items if no data
        ;[
          ['45-SW-041-001', 'WATER PUMP A650', '1 PL', 'Rp -'],
          ['45-SW-041-002', 'WATER PUMP PV400', '1 PL', 'Rp -'],
          ['45-SW-041-003', 'WATER PUMP PV500', '1 PL', 'Rp -'],
        ].forEach((row) => {
          y = drawTableRow(row, y)

          // Draw horizontal line between rows
          doc.line(margin, y - 6, pageWidth - margin, y - 6)
        })
      }

      // Draw vertical lines for columns
      let colX = margin
      const colWidths = [0.25, 0.35, 0.2, 0.2] // Same proportions as in drawTableRow

      colWidths.forEach((width, i) => {
        if (i < colWidths.length - 1) {
          colX += tableWidth * width
          doc.line(colX, y - 6 - (entry.items?.length || 3) * 10 - 10, colX, y - 6)
        }
      })

      y += 15

      // Total information table
      const totalTable = [
        ['Subtotal', ':', formatCurrency(entry.sub_total || 0)],
        ['Tax', ':', formatCurrency(entry.tax_amount || 0)],
        ['TOTAL', ':', formatCurrency(entry.total_amount || entry.sub_total || 0)],
      ]

      // Draw total info right-aligned
      totalTable.forEach((row, index) => {
        const labelX = pageWidth - margin - 80
        const colonX = pageWidth - margin - 30
        const valueX = pageWidth - margin

        if (index === 2) {
          doc.setFont('helvetica', 'bold') // Make the total line bold
        } else {
          doc.setFont('helvetica', 'normal')
        }

        doc.text(row[0], labelX, y)
        doc.text(row[1], colonX, y)
        doc.text(row[2], valueX, y, { align: 'right' })

        y += 8
      })

      y += 15

      // Payment terms
      doc.setFont('helvetica', 'bold')
      doc.text('Terms of Payment:', margin, y)
      y += 8

      doc.setFont('helvetica', 'normal')
      doc.text(entry.termin || 'Payment due within 30 days after delivery', margin, y)

      y += 20

      // Notes section
      doc.setFont('helvetica', 'bold')
      doc.text('Note:', margin, y)
      y += 8

      doc.setFont('helvetica', 'normal')
      doc.text('- Delivery time: READY 3 WEEKS AFTER PO', margin, y)
      y += 8
      doc.text('- Prices are valid for 7 days from quotation date', margin, y)
      y += 8
      doc.text(
        '- If you have any questions concerning this quotation, please contact us',
        margin,
        y,
      )

      y += 20

      // Signature
      doc.text('Yours Sincerely,', margin, y)
      y += 30

      doc.line(margin, y, margin + 50, y)
      y += 8
      doc.text('(                                 )', margin, y)

      // Footer
      const footerY = doc.internal.pageSize.height - 20
      doc.setFontSize(8)
      doc.text('THANK YOU FOR YOUR BUSINESS!', pageWidth / 2, footerY, { align: 'center' })

      // Save the PDF
      doc.save(`quotation-${entry.code_quatation}.pdf`)
    }
    // Helper function for number formatting
    const formatNumber = (num) => {
      return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'
    }

    return {
      viewData,
      editData,

      // State
      loading,
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
      exportData,
      exportToPDF,
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
