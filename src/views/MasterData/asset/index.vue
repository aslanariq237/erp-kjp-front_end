<template>
    <AdminLayout>
        <div class="d-flex justify-content-start px-10">
            <div class="flex justify-between items-center">
                <div class="title">
                    <p class="text-xl font-semibold dark:text-white">Asset</p>
                    <p class="text-gray-400 ">Master Data / Asset</p>
                </div>
                <div class="new">
                    <RouterLink to="/asset/form"
                        class="px-3 py-3 my-2 text-xl bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer text-white">
                        Add New</RouterLink>
                </div>
            </div>
            <div class="line border-b-2  py-4"></div>
            <div class="contain p-2 mt-4">
                <div class="filter">

                </div>
                <div class="p-4 rounded-md shadow-md">
                    <div class="relative overflow-x-auto">
                        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead
                                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                            </tbody>
                        </table>
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

import { RouterLink } from 'vue-router';
DataTable.use(DataTablesCore);

export default defineComponent({
    components: {
        AdminLayout,
        DataTable
    },
    data() {
        const columns = []
        return {

        }
    },
    async mounted() { },
    // methods: {

    // }
})
</script>
