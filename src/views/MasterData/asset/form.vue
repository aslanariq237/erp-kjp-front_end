<!-- eslint-disable vue/block-lang -->
<template>
    <AdminLayout>
        <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
            <!-- Notification -->
            <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
                @close="notification.show = false" />

            <!-- Header Card -->
            <div class="bg-white rounded-lg shadow-md mb-6">
                <div class="flex justify-between items-center p-6 border-b">
                    <div class="breadcrumb">
                        <h1 class="text-2xl font-bold text-gray-800">Create New Assets</h1>
                        <p class="text-gray-500 text-sm mt-1">Master Data / Assets / Form</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <RouterLink to="/asset"
                            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
                            <i class="fas fa-times"></i>
                            Cancel
                        </RouterLink>
                        <button type="submit"
                            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                            <i v-else class="fas fa-check"></i>
                            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Form Card -->
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                    <!-- No -->
                    <!-- Total Service -->
                    <!-- Issue Date -->
                    <FormGroup label="Issue Date" :required="true" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="date" id="issue_at" name="issue_at" v-model="issue_at"
                            :class="inputClass(rules.issue_at)" />
                    </FormGroup>

                    <!-- Due Date -->
                    <FormGroup label="Due Date" :required="true" :error="rules.due_at"
                        errorMessage="Due Date is required">
                        <input type="date" id="due_at" name="due_at" v-model="due_at"
                            :class="inputClass(rules.due_at)" />
                    </FormGroup>
                    <FormGroup label="Assets Name" :required="true" :error="rules.deposit"
                        errorMessage="po Number is required">
                        <input type="text" id="deposit" name="deposit" v-model="assets_name"
                            :class="inputClass(rules.deposit)" placeholder="Enter Asset Name" />
                    </FormGroup>
                    <!-- vendor -->
                    <FormGroup label="Vendor Name" class="relative" :required="true" :error="rules.vendor_id"
                        errorMessage="vendor is Required">
                        <input type="text" name="vendor_name" id="vendor_name" v-model="vendor_name"
                            @input="filtervendors" class="rounded w-full" placeholder="Type Vendor Name" />
                        <ul v-if="filteredvendors.length" class="border rounded w-full mt-2 bg-white absolute">
                            <li v-for="vendor in filteredvendors" :key="vendor.vendor_id" @click="selectvendor(vendor)"
                                class="p-2 cursor-pointer hover:bg-gray-200">
                                {{ vendor.vendor_name }}
                            </li>
                        </ul>
                    </FormGroup>

                    <!-- Total Service -->
                    <FormGroup label="Price" :required="true" :error="rules.deposit" errorMessage="Deposit is required">
                        <input type="number" id="deposit" name="deposit" v-model="price"
                            :class="inputClass(rules.deposit)" placeholder="Enter Price" />
                    </FormGroup>
                    <FormGroup label="Asset Life" :required="true" :error="rules.deposit"
                        errorMessage="Deposit is required">
                        <input type="number" id="deposit" name="deposit" v-model="umur_assets"
                            :class="inputClass(rules.deposit)" placeholder="" />
                    </FormGroup>
                </div>
            </div>
        </Form>
    </AdminLayout>
</template>

<script>
import { defineComponent } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import Swal from 'sweetalert2'
import Notification from '@/components/Notification.vue'
import FormGroup from '@/components/FormGroup.vue'
import axios from 'axios'
import { AddAsset, Vendor } from '@/core/utils/url_api'
import router from '@/router'

export default defineComponent({
    name: 'PurchaseOrderForm',
    components: {
        AdminLayout,
        Form,
        Field,
        ErrorMessage,
        Notification,
        FormGroup,
    },

    data() {
        return {
            assets_name: '',
            vendor_name: '',
            vendor_id: null,
            filteredvendors: [],
            price: 0,
            issue_at: '',
            due_at: '',
            umur_assets: 0,
            //others
            isSubmitting: false,
            notification: {
                show: false,
                type: 'success',
                message: '',
            },
            rules: {
                vendor_id: false,
                id_payment_type: false,
            },
            sales_order_details: [],
        }
    },
    async mounted() {
        this.getvendor()
        this.issue_at = new Date().toLocaleDateString('en-CA')
    },

    methods: {
        updateAmount(poDetail) {
            const discountPercentage = parseFloat(poDetail.discount) || 0
            const discountedPrice = poDetail.price * (1 - discountPercentage / 100)
            poDetail.amount = discountedPrice * poDetail.quantity
        },

        getvendor() {
            axios.get(Vendor).then((res) => {
                var data = res.data
                this.vendors = data
            })
        },
        getProducts() {
            axios.get(Product).then((res) => {
                var data = res.data
                this.products = data
            })
        },
        getEmployee() {
            axios.get(Employee).then((res) => {
                var data = res.data
                this.employees = data
            })
        },

        // Helper method to format date as YYYY-MM-DD
        formatDate(date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        },

        filtervendors() {
            const searchTerm = this.vendor_name.toLowerCase()
            this.filteredvendors = this.vendors.filter((vendor) => {
                const name = vendor.vendor_name.toLowerCase()
                return name.includes(searchTerm)
            })
        },
        selectvendor(vendor) {
            this.vendor_id = vendor.vendor_id
            this.vendor_name = vendor.vendor_name
            this.filteredvendors = []
        },

        showNotification(type, message) {
            this.notification = {
                show: true,
                type,
                message,
            }

            // Hide notification after 3 seconds
            setTimeout(() => {
                this.notification.show = false
            }, 3000)
        },

        async validation() {
            var count = 0

            if (this.vendor_id == '' || this.vendor_id == null) {
                this.rules.vendor_id = true
                count++
            } else {
                this.rules.vendor_id = false
            }

            return count
        },

        async onSubmit() {
            const result = 2
            if (result != 0) {
                await axios
                    .post(AddAsset, {
                        vendor_id: this.vendor_id,
                        issue_at: this.issue_at,
                        due_at: this.due_at,
                        assets_name: this.assets_name,
                        price: this.price,
                        assets_life: this.umur_assets,
                    })
                    .then(
                        (response) => {
                            console.log(response)
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Data has been Saved',
                            });
                        },
                        (error) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text:
                                    (error.response && error.response && error.response.message) ||
                                    error.message ||
                                    error.toString(),
                            })
                        },
                    )
            }
        },

        inputClass(error) {
            return [
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                error
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500',
            ]
        },
    },
})
</script>

<style scoped>
/* Add your styles here */
</style>