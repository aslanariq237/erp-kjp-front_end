<template>
    <AdminLayout>
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center mb-6">
                <div class="breadcrumb">
                    <h1 class="text-2xl font-bold text-gray-800">Account Payable Management</h1>
                    <p class="text-gray-500 text-sm mt-1">Finance Tools / Account Payable</p>
                </div>
                <div class="flex gap-3">
                    <button @click="exportData"
                        class="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                        <span>Export</span>
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="form-group">
                        <label class="text-sm font-medium text-gray-600 mb-2 block">Search</label>
                        <div class="relative">
                            <input type="text" v-model="searchQuery" placeholder="Search by name or account..."
                                class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <span class="absolute left-3 top-2.5 text-gray-400">
                                <!-- Search icon placeholder -->
                                🔍
                            </span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="text-sm font-medium text-gray-600 mb-2 block">Status</label>
                        <select v-model="sortBy"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="unpaid">Unpaid</option>
                            <option value="partial">Partial</option>
                            <option value="full">Full</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="text-sm font-medium text-gray-600 mb-2 block">Data</label>
                        <select v-model="status"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="purchase">Purchase order</option>
                            <option value="jasakirim">Jasa Kirim</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-sm">
                <div class="overflow-x-auto">
                    <table class="divide-y divide-y-auto">
                        <thead class="bg-gray-50">
                            <tr>
                                <th v-for="header in tableHeaders" :key="header.key"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                    {{ header.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="loading" class="text-center"></tr>
                            <tr v-else-if="paginatedData.length === 0" class="text-center">
                                <td colspan="5" class="px-6 py-4">No data found</td>
                            </tr>
                            <tr v-for="(account, index) in paginatedData" :key="index"
                                class="hover:bg-gray-50 transition-colors duration-150">
                                <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div class="text-slate-600 px-2 text-center rounded-xl bg-gray-400" :class="{
                                        'bg-green-400 text-white': account.status_payment === 'full',
                                        'bg-yellow-300 text-white': account.status_payment === 'partial'
                                    }">
                                        {{ account.status_payment ? account.status_payment : 'unpaid' }}
                                    </div>
                                </td>
                                <td class="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ account.code_po ? account.code_po : account.code_jasakirim }}
                                </td>
                                <td class="px-3 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ account.vendor.vendor_name }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatCurrency(account.deposit) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatCurrency(account.grand_total) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {{ formatCurrency(account.grand_total - account.deposit) }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ account.issue_at }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">{{ account.due_at }}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">
                                        {{ calculateDay(account.issue_at, account.due_at) }} days
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div class="flex space-x-3">
                                        <button @click="openModal(account)" class="text-green-600 hover:text-green-900"
                                            v-if="account.status_payment != 'full'">
                                            Posting
                                        </button>
                                        <button v-if="account.status_payment != 'unpaid'" @click="resetPrice(account)"
                                            class="text-yellow-600 hover:text-yellow-900">
                                            Reset
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="isModalOpen"
                        class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
                        <div class="bg-white p-8 rounded-xl w-96 shadow-xl transform transition-all duration-300">
                            <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Pembayaran</h2>

                            <!-- Total Amount Display -->
                            <div class="mb-5">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Total Pembayaran</label>
                                <div class="p-3 bg-gray-100 rounded-lg border border-gray-200">
                                    <span class="text-lg font-semibold text-gray-800">Rp. {{ selectedItem ?
                                        formatCurrency(selectedItem.grand_total) : 0 }}</span>
                                </div>
                            </div>

                            <!-- Current Deposit Display -->
                            <div class="mb-5">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Terbayar</label>
                                <div class="p-3 bg-gray-100 rounded-lg border border-gray-200">
                                    <span class="text-lg font-semibold text-gray-800">Rp. {{ selectedItem ?
                                        formatCurrency(selectedItem.deposit) : 0 }}</span>
                                </div>
                            </div>

                            <div class="mb-5">
                                <label for="deposit-amount" class="block text-sm font-medium text-gray-700 mb-2">
                                    Issue At
                                </label>
                                <div class="relative">
                                    <div class="flex space-x-3">
                                        <input id="Issue At" type="date" v-model="issue_today"
                                            class="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                                    </div>
                                </div>
                            </div>

                            <!-- New Additional Deposit Input -->
                            <div class="mb-5">
                                <label for="deposit-amount" class="block text-sm font-medium text-gray-700 mb-2">
                                    Total Dibayarkan
                                </label>
                                <div class="relative">
                                    <span
                                        class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">Rp.</span>
                                    <div class="flex space-x-3">
                                        <input id="deposit-amount" type="number" v-model.number="additionalDeposit"
                                            @change="changePrice(selectedItem)"
                                            class="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            placeholder="0.00" />
                                        <button
                                            class="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            @click="additionalDeposit = selectedItem.grand_total - selectedItem.deposit">
                                            Lunas
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Total After Change -->
                            <div class="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div class="flex justify-between items-center">
                                    <span class="text-sm font-medium text-blue-800">New Total Payment:</span>
                                    <span class="text-lg font-bold text-blue-800">
                                        Rp.
                                        {{
                                            selectedItem ? formatCurrency(Number(selectedItem.deposit || 0) +
                                                Number(additionalDeposit || 0)) :
                                                0
                                        }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex justify-end space-x-3">
                                <button
                                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-5 rounded-lg transition-colors duration-200"
                                    @click="closeModal">
                                    Cancel
                                </button>
                                <button
                                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition-colors duration-200 flex items-center"
                                    @click="saveDeposit">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                        <button @click="currentPage = 1" :disabled="currentPage === 1" class="pagination-button"
                            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                            First
                        </button>
                        <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-button"
                            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                            Previous
                        </button>
                        <div class="flex space-x-1">
                            <button v-for="page in displayedPages" :key="page" @click="currentPage = page"
                                class="pagination-button" :class="{ 'bg-blue-600 text-white': currentPage === page }">
                                {{ page }}
                            </button>
                        </div>
                        <button @click="currentPage++" :disabled="currentPage >= totalPages" class="pagination-button"
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
    </AdminLayout>
</template>
<script>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ApiServices from '@/core/services/ApiServices';
import { AccPayable, AccPayableDeposit, AccPayableReset } from '@/core/utils/url_api';
import Swal from 'sweetalert2';
import { defineComponent } from 'vue';
export default defineComponent({
    name: "Account Payable",
    components: {
        AdminLayout
    },
    data() {
        const tableHeaders = [
            { key: 'status', label: 'Status' },
            { key: 'no', label: 'Code Po' },
            { key: 'name', label: 'Name' },
            { key: 'Terbayar', label: 'Terbayar' },
            { key: 'Amount', label: 'Amount' },
            { key: 'Debt', label: 'Debt' },
            { key: 'Debt', label: 'Issue Date' },
            { key: 'Debt', label: 'Due Date' },
            { key: 'Debt', label: 'Aging' },
            { key: 'actions', label: 'Actions' },
        ]
        const monthNames = [
            '', // index 0 (not used)
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        return {
            purchase: [],
            jasakirim: [],
            searchQuery: '',
            tableHeaders: tableHeaders,
            monthNames: monthNames,
            status: 'purchase',
            sortBy: 'unpaid',
            loading: false,
            selectedItem: null,
            isModalOpen: false,
            additionalDeposit: 0,
            editedDeposit: 0,
            itemsPerPage: 10,
            currentPage: 1,
            issue_today: new Date().toLocaleDateString('en-CA'),
        }
    },
    mounted() {
        this.getData();
    },
    methods: {
        async getData() {
            const res = await ApiServices.get(AccPayable);
            var data = res.data;
            this.purchase = data.purchase;
            this.jasakirim = data.jasakirim;
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'IDR'
            }).format(value);
        },
        calculateDay(issue_at, due_at) {
            const today = new Date();
            const due_date = new Date(due_at);

            const timeDiff = due_date.getTime() - today.getTime();
            const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            return dayDiff;
        },
        openModal(item) {
            this.selectedItem = item;
            this.editedDeposit = item.deposit;
            this.additionalDeposit = 0;
            this.isModalOpen = true;
        },
        changePrice(item) {
            var total = item.grand_total - item.deposit;
            if (this.additionalDeposit > total) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Pembayaran melebihi batas',
                    confirmButtonText: 'Try Again'
                });
            }
        },
        async saveDeposit() {
            try {
                var deposit = Number(this.selectedItem.deposit || 0) + Number(this.additionalDeposit || 0);
                var status_payment = 'unpaid';
                if (deposit >= this.selectedItem.grand_total) {
                    status_payment = 'full';
                } else if (deposit > 0 && deposit != this.selectedItem.grand_total) {
                    status_payment = 'partial';
                }
                const response = await ApiServices.put(AccPayableDeposit + '/' + this.selectedItem.id_po, {
                    deposit: deposit,
                    id_po: this.selectedItem.id_po,
                    status_payment: status_payment,
                    payment_method: 'Transfer',
                    issue_at: this.issue_today,
                });

                if (response.status === 200) {
                    this.closeModal();
                    Swal.fire({
                        icon: 'success',
                        title: 'Pembayaran Sukses',
                    }).then(async (res) => {
                        await this.getData();
                    })
                }
            } catch (error) {
                console.error('Failed to update Deposit', error);
            }
        },
        closeModal() {
            this.isModalOpen = false;
            this.selectedItem = null;
        },
        resetPrice(item) {
            Swal.fire({
                icon: 'warning',
                text: 'apakah anda ingin mengulang pembayaran ini?',
                confirmButtonText: 'Ya'
            }).then(async (res) => {
                if (res.isConfirmed) {
                    var status_payment = 'unpaid';
                    var deposit = 0;

                    await ApiServices.put(AccPayableReset + '/' + item.id_po, {
                        deposit: deposit,
                        status_payment: status_payment
                    }).then(async (res) => {
                        Swal.fire({
                            icon: 'success',
                            text: 'Berhasil Reset Pembayaran',
                        });
                        if (res.status === 200) {
                            await this.getData();
                        }
                    })
                }
            })
        },        

        formatDateWithMonthString(dateStr){
            // dateStr: '2025-01-08' or similar
            const date = new Date(dateStr)
            const day = date.getDate()
            const month = date.getMonth() + 1 // getMonth() returns 0-based
            const year = date.getFullYear()
            return `${this.monthNames[month]}`
        },
        exportData() {
            let data = [...this.purchase, ...this.jasakirim].map((account) => {
                const payments = account.payment || [];
                const paymentData = {
                    'Payment 1': payments[0]?.code_paymentpo ? payments[0]?.code_paymentpo : "payment",
                    'Payment Date 1': payments[0]?.issue_at ? payments[0]?.issue_at : account.issue_at,
                    'Payment 2': payments[1]?.code_paymentpo || '',
                    'Payment Date 2': payments[1]?.issue_at || '',
                }

                return {
                    'Code Po': account.code_po ? account.code_po : account.code_jasakirim,
                    Vendor: account.vendor.vendor_name,
                    Terbayar: account.deposit,
                    Amount: account.grand_total,
                    Debt: account.grand_total - account.deposit,
                    Bulan: this.formatDateWithMonthString(account.issue_at),
                    'Issue Date': account.issue_at,
                    'Due Date': account.due_at,
                    Aging: this.calculateDay(account.issue_at, account.due_at),
                    "Status AP": account.status_payment,
                    ...paymentData,
                }
            });

            const headers = [
                'Code Po',
                'Vendor',
                'Terbayar',
                'Debt',
                'Bulan',
                'Issue Date',
                'Due Date',
                'Aging',
                'Status AP',
                'Payment 1',
                'Payment Date 1',
                'Payment 2',
                'Payment Date 2'
            ]
            const csvContent = [
                headers.join(','),
                ...data.map((row) =>
                    headers.map((header) => `"${row[header]}"`).join(',')),
            ].join('\n')

            const blob = new Blob([csvContent], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('href', url)
            a.setAttribute('download', `account-payable-${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        }
    },
    computed: {
        filteredData() {
            let result = null;

            if (this.status === 'purchase') {
                result = this.purchase;
            } else if (this.status === 'jasakirim') {
                result = this.jasakirim;
            }

            // if (searchQuery.value) {
            //     const query = this.searchQuery.toLocaleLowerCase()
            //     result = result.filter((entry) => {
            //         const vendor = entry.vendor && entry.vendor.vendor_name
            //             ? entry.vendor.vendor_name.toLowerCase()
            //             : ''
            //         const code_po = entry.code_po || entry.code_jasakirim || ''
            //         return vendor.includes(query) ||
            //             code_po.includes(query)
            //     })
            // }

            if (this.sortBy === 'unpaid') {
                result = result.filter(a => a.grand_total - a.deposit > 0 && a.grand_total != a.deposit)
            } else if (this.sortBy === 'partial') {
                result = result.filter(a => a.status_payment === 'partial')
            } else if (this.sortBy === 'full') {
                result = result.filter(a => a.status_payment === 'full' || a.grand_total == a.deposit)
            }

            return result;
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
        }
    },
});
</script>
