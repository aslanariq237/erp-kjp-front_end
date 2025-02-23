<template>
    <AdminLayout>
        <div class="d-flex justify-content-start px-10">
            <div class="flex justify-between items-center">
                <div class="title">
                    <p class="text-xl font-semibold">Customer</p>
                    <p class="text-gray-400">Master Data / Customer</p>
                </div>
                <div class="new">
                    <RouterLink to="/customer/form"
                        class="px-3 py-3 my-2 text-xl bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer text-white">
                        Add New</RouterLink>
                </div>
            </div>
            <div class="line border-b-2 py-4"></div>
            <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="form-group">
            <label class="text-sm text-gray-600 mb-1 block">Search</label>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search employees..."
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
              <option value="email">Email</option>
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
        </div>
    </AdminLayout>
</template>
<script>
import AdminLayout from '@/components/layout/AdminLayout.vue';


import { defineComponent } from "vue";
import DataTable from "datatables.net-vue3";
import DataTablesCore from 'datatables.net-dt';
import ApiCustomer from "../../../core/controllers/master_data/customer.api.js"
import axios from 'axios';
import { RouterLink } from 'vue-router';
import { Customer } from '@/core/utils/url_api';
DataTable.use(DataTablesCore)

export default defineComponent({
    components: {
        AdminLayout,
        DataTable,
    },
    data() {
        const cust = ref([
            {
                id: 1,
                name : 'udin',
                phone : '+18821312',
                email : 'udin@gmail.com',
                address : '123 ast'
            }
        ])
        return {
            customers: null,
        }
    },
    async mounted() {        
        this.getData();
    },
    methods: {
        async getData() {                        
            await axios.get(Customer, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            }).then(( res) => {
                var data = res.data
                console.log(data);
            });
            // ApiCustomer.getCode().then((res) => {
            //     var data = res;
            //     // this.customers = data;
            //     console.log(data)
            // })
        }
    }
})
</script>
