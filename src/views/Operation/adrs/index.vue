<template>
    <AdminLayout>
      <div class="container mx-auto px-6 py-4">
        <!-- Header Section -->
        <div class="flex justify-between items-center mb-6">
          <div class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">ADRS Management</h1>
            <p class="text-gray-500 text-sm mt-1">SCM / ADRS</p>
          </div>
          <RouterLink
            to="/adrs/form"
            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
          >
            Add New ADRS
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
                placeholder="Search products..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div class="form-group">
              <label class="text-sm text-gray-600 mb-1 block">Sort By</label>
              <select
                v-model="sortBy"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="id">ID</option>
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
                  ADRS Code
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ADRS PN
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ADRS Descrtiption
                </th>                
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>              
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(product, index) in paginatedData"
                :key="product.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ product.code_package }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.package_sn }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ product.package_desc }}</div>
                </td>            
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="editProduct(product.package_id)" class="text-blue-600 hover:text-blue-900">
                      Edit
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
  import AdminLayout from '@/components/layout/AdminLayout.vue'
  import { RouterLink, useRoute } from 'vue-router'
  import { PackageADRS, Product } from '@/core/utils/url_api';
  import axios from 'axios';
  import router from '@/router';
  
  export default defineComponent({
    name: 'ProductPage',
    components: {
      AdminLayout,
    },  
  
    setup() {
      const products = ref([]);
      // Data   
  
      const getProduct = async () => {
        try{
          const res = await axios.get(PackageADRS)
          products.value = res.data        
        }catch(error){
          console.error('Error Fetching : ', error)
        }
      }
  
      onMounted(() => {
        getProduct();
        const route = useRoute();
        const id = route.params.id;
        if (id){

        }
      })
  
      // Filtering and Sorting
      const searchQuery = ref('')
      const sortBy = ref('name')
      const currentPage = ref(1)
      const itemsPerPage = ref(10)    
  
      const filteredData = computed(() => {
        let result = [...products.value]
  
        // Search
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          result = result.filter((product) =>{
            const productname = product.package_desc.toLowerCase()
            const product_sn = product.package_sn.toLowerCase()
            return productname.includes(query) || product_sn.includes(query)
          }            
          )
        }        
  
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
      const editProduct = (product) => {
        router.push('/adrs/edit/' + product);      
      }
  
      const deleteProduct = (product) => {
        if (confirm('Are you sure you want to delete this product?')) {
          console.log('Delete product:', product)
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
        editProduct,
        deleteProduct,
        products,
      }
    },
  })
  </script>
  