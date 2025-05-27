<template>
  <div
    class="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Performance</h3>

      <div class="relative h-fit">
        <DropdownMenu :menu-items="menuItems">
          <template #icon>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.2441 6C10.2441 5.0335 11.0276 4.25 11.9941 4.25H12.0041C12.9706 4.25 13.7541 5.0335 13.7541 6C13.7541 6.9665 12.9706 7.75 12.0041 7.75H11.9941C11.0276 7.75 10.2441 6.9665 10.2441 6ZM10.2441 18C10.2441 17.0335 11.0276 16.25 11.9941 16.25H12.0041C12.9706 16.25 13.7541 17.0335 13.7541 18C13.7541 18.9665 12.9706 19.75 12.0041 19.75H11.9941C11.0276 19.75 10.2441 18.9665 10.2441 18ZM11.9941 10.25C11.0276 10.25 10.2441 11.0335 10.2441 12C10.2441 12.9665 11.0276 13.75 11.9941 13.75H12.0041C12.9706 13.75 13.7541 12.9665 13.7541 12C13.7541 11.0335 12.9706 10.25 12.0041 10.25H11.9941Z"
                fill="currentColor"
              />
            </svg>
          </template>
        </DropdownMenu>
      </div>
    </div>

    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <div id="combinedChart" class="-ml-5 min-w-[650px] xl:min-w-full pl-2">
        <VueApexCharts type="line" height="350" :options="chartOptions" :series="series" />
      </div>
    </div>

    <div class="mt-2 flex flex-wrap gap-3 justify-center">
      <div v-for="(item, index) in series" :key="index" class="flex items-center">
        <span
          class="inline-block h-3 w-3 mr-1"
          :style="{ backgroundColor: chartOptions.colors[index] }"
        ></span>
        <span class="text-sm">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DropdownMenu from '../common/DropdownMenu.vue'
import VueApexCharts from 'vue3-apexcharts'
import axios from 'axios'

// URLs for API endpoints
import { SalesOrdersMonthly, Quatations } from '@/core/utils/url_api'

const menuItems = [
  { label: 'View Details', onClick: () => console.log('View Details clicked') },
  { label: 'Download Data', onClick: () => console.log('Download Data clicked') },
  { label: 'Export as PDF', onClick: () => console.log('Export as PDF clicked') },
]

// Initialize all series with empty data
const series = ref([
  {
    name: 'Invoices',
    data: Array(12).fill(0),
  },
  {
    name: 'Sales',
    data: Array(12).fill(0),
  },
  {
    name: 'Quatations',
    data: Array(12).fill(0),
  },
  {
    name: 'Sales Target',
    data: Array(12).fill(0),
  },
])

// Function to fetch invoice data
const getInvoice = async () => {
  try {
    const res = await axios.get(SalesOrdersMonthly)
    const data = res.data
    const monthData = Array(12).fill(0)

    data.forEach((item) => {
      const monthIndex = item.month - 1 // Convert month (1-12) to array index (0-11)
      monthData[monthIndex] = item.total_sales
    })

    series.value[0].data = monthData
  } catch (err) {
    console.error('Error fetching invoice data:', err)
  }
}

// Function to fetch sales data
const getSales = async () => {
  try {
    const res = await axios.get(SalesOrdersMonthly)
    const data = res.data
    const monthData = Array(12).fill(0)

    data.forEach((item) => {
      const monthIndex = item.month - 1
      monthData[monthIndex] = item.total_sales
    })

    series.value[1].data = monthData
  } catch (err) {
    console.error('Error fetching sales data:', err)
  }
}
const setSalesTarget = () => {
  // Generate random target values between 2-3 million IDR
  const generateTarget = () => {
    return Math.floor(1000000000)
  }

  // Create an array of target values for each month
  const targetData = Array(12)
    .fill(0)
    .map(() => generateTarget())

  // Set the target data to the series
  series.value[3].data = targetData
}
const fetchSalesData = async () => {
  try {
    // Use a different endpoint or parameter to distinguish from invoice data
    const res = await axios.get(SalesOrdersMonthly + '?type=sales')
    // ...processing code...
  } catch (err) {
    // Fallback: Generate example data that's different from invoices
    const invoiceData = [...series.value[0].data]
    const sampleSalesData = invoiceData.map((val) => Math.round(val * 1.15))
    series.value[1].data = sampleSalesData
  }
}

// Function to fetch quotation data
const getQuotation = async () => {
  try {
    const res = await axios.get(Quatations + '/monthly')
    const data = res.data
    const monthData = Array(12).fill(0)

    data.forEach((item) => {
      const monthIndex = item.month - 1
      monthData[monthIndex] = item.total_sales
    })

    series.value[2].data = monthData
  } catch (err) {
    console.error('Error fetching quotation data:', err)
  }
}

// Fetch all data when component mounts)
onMounted(async () => {
  await Promise.all([getInvoice(), getSales(), getQuotation(), setSalesTarget()])
})

// Format currency function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
  }).format(value)
}

// Chart options
const chartOptions = ref({
  colors: ['#465fff', '#00E396', '#FEB019', '#FF4560'],
  chart: {
    fontFamily: 'Outfit, sans-serif',
    type: 'line',
    height: 350,
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
      },
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
    },
  },
  stroke: {
    width: [3, 3, 3, 3],
    curve: 'smooth',
    dashArray: [0, 0, 0, 0],
  },
  markers: {
    size: 4,
    hover: {
      size: 6,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: '#e0e6ed',
    row: {
      colors: ['#f8f9fa', 'transparent'],
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
    labels: {
      style: {
        colors: '#616161',
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
      },
    },
  },
  yaxis: {
    title: {
      text: 'Amount (IDR)',
      style: {
        color: '#616161',
        fontSize: '14px',
        fontFamily: 'Outfit, sans-serif',
      },
    },
    labels: {
      formatter: function (value) {
        // Format with K, M, B for thousands, millions, billions
        if (value >= 1000000000) return (value / 1000000000).toFixed(1) + 'B'
        if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M'
        if (value >= 1000) return (value / 1000).toFixed(1) + 'K'
        return value.toString()
      },
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (value) {
        return formatCurrency(value)
      },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
    offsetY: -10,
    fontSize: '13px',
    fontFamily: 'Outfit, sans-serif',
    markers: {
      width: 10,
      height: 10,
      strokeWidth: 0,
      radius: 12,
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        legend: {
          show: false,
        },
      },
    },
  ],
})
</script>
