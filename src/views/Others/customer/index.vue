<template>
    <AdminLayout>
        <div class="d-flex justify-content-start px-10">
            <div class="flex justify-between items-center">
                <div class="title">
                    <p class="text-xl font-semibold">Customer</p>
                    <p class="text-gray-400">Master Data / Customer</p>
                </div>
                <div class="new">
                    <RouterLink to="/customer/form" class="px-3 py-3 my-2 text-xl bg-blue-500 rounded-md hover:bg-blue-600 cursor-pointer text-white">Add New</RouterLink>                    
                </div>
            </div>
            <div class="line border-b-2 py-4"></div>
            <div class="contain p-2 mt-4">
                <div class="filter">

                </div>
                <div class="">
                    <DataTable                        
                        class="border-gray-300 shadow-md my-4 text-lg display row-border align-middle table-row-dashed"
                    >
                        <thead>
                            <tr class=" text-center">
                                <td>No</td>
                                <td>Name</td>
                                <td>phone</td>
                                <td>number</td>
                                <td>email</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="column in columns" :key="column.id" class="text-center">
                                <td>{{ column.id }}</td>
                                <td>{{ column.name }}</td>
                                <td>{{ column.phone }}</td>
                                <td>{{ column.numberrange }}</td>
                                <td>{{ column.email }}</td>
                            </tr>
                        </tbody>
                    </DataTable>                                        
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
DataTable.use(DataTablesCore)

export default defineComponent({
    components: {
        AdminLayout,  
        DataTable,            
    },    
    data() {
        const columns = []        
      return{
               
      }
    },
    async mounted(){},
    // methods: {

    // }
})
</script>
