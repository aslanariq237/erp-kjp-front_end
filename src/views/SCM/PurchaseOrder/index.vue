<template>
    <AdminLayout>
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center mb-6">
                <div class="breadcrumb">
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Purchase Order</h1>
                    <p class="text-gray-500 text-sm mt-1">SCM / Purchase Order</p>
                </div>
                <div class="flex gap-3">
                    <button @click="exportData"
                        class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                        <span>Export</span>
                    </button>
                    <button>
                        <RouterLink to="/purchase-order/form"
                            class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                            Add New Purchase Order
                        </RouterLink>
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6 dark:bg-gray-800 dark:text-gray-400">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="form-group">
                        <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
                        <div class="relative">
                            <input type="text" v-model="searchQuery" placeholder="Search by code..."
                                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <span class="absolute left-3 top-2.5 text-gray-400">
                                <!-- Search icon placeholder -->
                                🔍
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="text-sm font-medium text-gray-600 mb-2 block">Date Range</label>
                        <div class="flex gap-2">
                            <input type="date" v-model="startDate"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="date" v-model="endDate"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex gap-2">
                <button type="button" @click="type = 'draft'" :class="[
                    'px-3 rounded-lg py-2',
                    type === 'draft' ? 'bg-blue-400 text-white' : ''
                ]">Draft</button>
                <button type="button" @click="type = 'posted'" :class="[
                    'px-3 rounded-lg py-2',
                    type === 'posted' ? 'bg-blue-400 text-white' : ''
                ]">
                    Posted</button>
                <button type="button" @click="type = 'deleted'" :class="[
                    'px-3 rounded-lg py-2',
                    type === 'deleted' ? 'bg-blue-400 text-white' : ''
                ]">
                    Deleted</button>
            </div>
            <div class="tab">
                <div class="pane" v-if="type === 'draft'">
                    <div class="bg-white mt-4 rounded-lg shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr class="dark:bg-gray-800 dark:text-gray-400">
                                        <th v-for="header in tableHeaders" :key="header.key"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            @click="sortBy = header.key">
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
                                    <tr v-else-if="paginatedData.length === 0"
                                        class="text-center dark:bg-gray-800 dark:text-gray-400">
                                        <td colspan="14" class="px-6 py-4">No data found</td>
                                    </tr>
                                    <tr v-for="(entry, index) in paginatedData" :key="entry.id_po"
                                        class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400">
                                        <td class="px-4 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">{{ entry.code_po }}</div>
                                        </td>
                                        <td class="px-4 py-4 whitespace-nowrap">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ entry.vendor.vendor_name }}
                                            </div>
                                        </td>
                                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatCurrency(entry.sub_total) }}
                                        </td>
                                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatCurrency(entry.ppn) }}
                                        </td>
                                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatCurrency(entry.grand_total) }}
                                        </td>
                                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ entry.issue_at }}
                                        </td>
                                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ entry.due_at }}
                                        </td>
                                        <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="viewData(entry.id_po)">
                                                    View
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="editData(entry.id_po)">
                                                    Edit
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="exportToPDF(entry)">
                                                    Export
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="editPPN(entry)" v-if="entry.deposit != entry.grand_total">
                                                    Edit PPN
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="approve(entry.id_po)">
                                                    Approve
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="deleteData(entry)">
                                                    Delete
                                                </button>
                                            </div>
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
                                    <button @click="currentPage = 1" :disabled="currentPage === 1"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                        First
                                    </button>
                                    <button @click="currentPage--" :disabled="currentPage === 1"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                        Previous
                                    </button>
                                    <div class="flex space-x-1">
                                        <button v-for="page in displayedPages" :key="page" @click="currentPage = page"
                                            class="pagination-button px-1 rounded-md"
                                            :class="{ 'bg-blue-600 text-white': currentPage === page }">
                                            {{ page }}
                                        </button>
                                    </div>
                                    <button @click="currentPage++" :disabled="currentPage >= totalPages"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                                        Next
                                    </button>
                                    <button @click="currentPage = totalPages" :disabled="currentPage >= totalPages"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                                        Last
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pane" v-if="type === 'posted'">
                    <div class="bg-white mt-4 rounded-lg shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr class="dark:bg-gray-800 dark:text-gray-400">
                                        <th v-for="header in tableHeaders" :key="header.key"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            @click="sortBy = header.key">
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
                                    <tr v-else-if="paginatedData.length === 0"
                                        class="text-center dark:bg-gray-800 dark:text-gray-400">
                                        <td colspan="14" class="px-6 py-4">No data found</td>
                                    </tr>
                                    <tr v-for="(entry, index) in paginatedData" :key="entry.id_po"
                                        class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400">
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
                                            {{ formatCurrency(entry.ppn) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatCurrency(entry.grand_total) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ entry.issue_at }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ entry.due_at }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="viewData(entry.id_po)">
                                                    View
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="editData(entry.id_po)">
                                                    Edit
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="exportToPDF(entry)">
                                                    Export
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="editPPN(entry)" v-if="entry.deposit != entry.grand_total">
                                                    Edit PPN
                                                </button>
                                            </div>
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
                                    <button @click="currentPage = 1" :disabled="currentPage === 1"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                        First
                                    </button>
                                    <button @click="currentPage--" :disabled="currentPage === 1"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                        Previous
                                    </button>
                                    <div class="flex space-x-1">
                                        <button v-for="page in displayedPages" :key="page" @click="currentPage = page"
                                            class="pagination-button px-1 rounded-md"
                                            :class="{ 'bg-blue-600 text-white': currentPage === page }">
                                            {{ page }}
                                        </button>
                                    </div>
                                    <button @click="currentPage++" :disabled="currentPage >= totalPages"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                                        Next
                                    </button>
                                    <button @click="currentPage = totalPages" :disabled="currentPage >= totalPages"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                                        Last
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pane" v-if="type === 'deleted'">
                    <div class="bg-white mt-4 rounded-lg shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr class="dark:bg-gray-800 dark:text-gray-400">
                                        <th v-for="header in tableHeaders" :key="header.key"
                                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            @click="sortBy = header.key">
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
                                    <tr v-else-if="paginatedData.length === 0"
                                        class="text-center dark:bg-gray-800 dark:text-gray-400">
                                        <td colspan="14" class="px-6 py-4">No data found</td>
                                    </tr>
                                    <tr v-for="(entry, index) in paginatedData" :key="entry.id_po"
                                        class="hover:bg-gray-50 transition-colors duration-150 dark:bg-gray-800 dark:text-gray-400">
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
                                            {{ formatCurrency(entry.ppn) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ formatCurrency(entry.grand_total) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ entry.issue_at }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ entry.due_at }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="viewData(entry.id_po)">
                                                    View
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="restoreData(entry.id_po)">
                                                    Restore
                                                </button>
                                                <button class="shadow-lg mr-2 px-3 py-2 rounded-lg"
                                                    @click="deleteData(entry)">
                                                    Delete
                                                </button>
                                            </div>
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
                                    <button @click="currentPage = 1" :disabled="currentPage === 1"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                        First
                                    </button>
                                    <button @click="currentPage--" :disabled="currentPage === 1"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                                        Previous
                                    </button>
                                    <div class="flex space-x-1">
                                        <button v-for="page in displayedPages" :key="page" @click="currentPage = page"
                                            class="pagination-button px-1 rounded-md"
                                            :class="{ 'bg-blue-600 text-white': currentPage === page }">
                                            {{ page }}
                                        </button>
                                    </div>
                                    <button @click="currentPage++" :disabled="currentPage >= totalPages"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                                        Next
                                    </button>
                                    <button @click="currentPage = totalPages" :disabled="currentPage >= totalPages"
                                        class="pagination-button"
                                        :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                                        Last
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>
<script>
import { createApp, defineComponent, h } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ApiServices from '@/core/services/ApiServices';
import { DetailPo, PurchaseOrder, PurchaseOrderDelete, PurchaseOrderRestore } from '@/core/utils/url_api';
import Swal from 'sweetalert2';
import router from '@/router';
import { exportPoPDF } from '@/core/helpers/exportToPdf';


export default defineComponent({
    components: {
        AdminLayout
    },
    data() {
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
        const monthNames = [
            '', // index 0 (not used)
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return {
            tableHeaders,
            monthNames,
            searchQuery: '',
            dataexcel: [],
            purchaseorders: [],
            type: 'draft',
            itemsPerPage: 10,
            currentPage: 1,
            ROWS_PER_PAGE: 12,
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        getData() {
            ApiServices.get(PurchaseOrder).then((res) => {
                var data = res.data;
                this.purchaseorders = data;
            });
        },
        viewData(id) {
            router.push('/purchase-order/view/' + id);
        },
        editData(id) {
            router.push('/purchase-order/edit/' + id);
        },
        async restoreData(entry) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, restore it!',
            })

            if (entry.has_gr) {
                Swal.fire({
                    icon: 'error',
                    text: 'GR has Created',
                });
            } else {
                if (result.isConfirmed) {
                    try {
                        await ApiServices.put(PurchaseOrderRestore + '/' + entry)
                        await this.getData();
                        Swal.fire('Deleted!', 'The Purchase Order has been deleted.', 'success')
                    } catch (error) {
                        Swal.fire('Error!', 'There was an error deleting the Purchase Order.', 'error')
                    }
                }
            }
        },
        async deleteData(entry) {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            })

            if (entry.has_gr) {
                Swal.fire({
                    icon: 'error',
                    text: 'GR has Created',
                });
            } else {
                if (result.isConfirmed) {
                    try {
                        await ApiServices.put(PurchaseOrderDelete + '/' + entry.id_po)
                        await this.getData();
                        Swal.fire('Deleted!', 'The Purchase Order has been deleted.', 'success')
                    } catch (error) {
                        Swal.fire('Error!', 'There was an error deleting the Purchase Order.', 'error')
                    }
                }
            }
        },
        approve(id) {
            ApiServices.post(PurchaseOrder + '/approve/' + id).then((res) => {
                Swal.fire({
                    icon: "success",
                    text: 'Berhasil Approve'
                }).then(async (res) => {
                    if (res.isConfirmed) {
                        this.getData();
                    }
                })
            })
        },
        editPPN(item) {
            Swal.fire({
                icon: 'question',
                text: 'Apakah anda Ingin Mengubah PPN',
            }).then(async (res) => {
                if (res.isConfirmed) {
                    ApiServices.post(PurchaseOrder + '/edit-ppn/' + item.id_po, {
                        sub_total: item.sub_total,
                        ppn: item.ppn,
                    });
                    await this.getData();
                }
            })
        },
        // exportToPDF(item) {
        //     exportPoPDF(item);
        // },

        //example
        async exportToPDF(item) {
            exportPoPDF(item);
        },        

        //end example
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'IDR'
            }).format(value);
        },

        formatDateWithMonthString(dateStr) {
            // dateStr: '2025-01-08' or similar
            const date = new Date(dateStr)
            const day = date.getDate()
            const month = date.getMonth() + 1 // getMonth() returns 0-based
            const year = date.getFullYear()
            return `${this.monthNames[month]}`
        },

        // Utility functions
        exportData() {
            ApiServices.get(DetailPo).then((res) => {
                var data = res.data;
                this.dataexcel = data;
            }).then((res) => {
                const data = this.dataexcel.map((entry) => ({
                    'Po Number': entry.purchaseorders.code_po,
                    'Vendor Name': entry.purchaseorders.vendor.vendor_name,
                    'Product Decs': entry.product.product_desc,
                    'product SN': entry.product.product_sn,
                    'Quantity': entry.quantity,
                    'Price': entry.price,
                    'Month': this.formatDateWithMonthString(entry.purchaseorders.issue_at),
                    'Issue Date': entry.purchaseorders.issue_at,
                    'Due Date': entry.purchaseorders.due_at,
                }));

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
            })
        }
    },
    computed: {
        filteredData() {
            let result = this.purchaseorders;

            if (this.type === 'draft') {
                result = result.filter((entry) => entry.approved != 1 && entry.is_deleted != 1);
            } else if (this.type === 'posted') {
                result = result.filter((entry) => entry.approved != 0);
            } else if (this.type === 'deleted') {
                result = result.filter((entry) => entry.is_deleted != 0);
            }

            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase()
                result = result.filter((entry) => {
                    const code_po = entry.code_po.toLowerCase();
                    const vendor_name = entry.vendor.vendor_name.toLowerCase();
                    return (
                        code_po.includes(query) ||
                        vendor_name.includes(query)
                    )
                })
            }
            return result
        },
        totalPages() {
            return Math.ceil(this.filteredData.length / this.itemsPerPage)
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage
        },
        endIdex() {
            return Math.min(this.startIndex + this.itemsPerPage, this.filteredData.length)
        },

        paginatedData() {
            return this.filteredData.slice(this.startIndex, this.endIdex);
        },
        displayedPages() {
            const delta = 2
            const range = []
            const rangeWithDots = []
            let l

            for (let i = 1; i <= this.totalPages; i++) {
                if (
                    i === 1 ||
                    i === this.totalPages ||
                    (i >= this.currentPage - delta && i <= this.currentPage + delta)
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
        },
    }
})
</script>