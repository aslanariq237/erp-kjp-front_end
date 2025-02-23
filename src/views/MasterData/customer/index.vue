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
            <div class="contain p-2 mt-4">
                <div class="filter">

                </div>
                <div class="">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    Product name
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Color
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Price
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                <th scope="row"
                                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    Apple MacBook Pro 17"
                                </th>
                                <td class="px-6 py-4">
                                    Silver
                                </td>
                                <td class="px-6 py-4">
                                    Laptop
                                </td>
                                <td class="px-6 py-4">
                                    $2999
                                </td>
                            </tr>
                            <template v-for="customer in customers" :key="customers.id">
                                <tr>
                                    <td>{{ customer.customer_name }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
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
import ApiService from '@/core/services/ApiServices.js';
DataTable.use(DataTablesCore)

export default defineComponent({
    components: {
        AdminLayout,
        DataTable,
    },
    data() {
        const columns = []
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
