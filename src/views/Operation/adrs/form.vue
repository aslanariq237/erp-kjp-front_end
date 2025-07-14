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
                        <h1 class="text-2xl font-bold text-gray-800">
                            {{ id ? "Edit ADRS" : "Create New ADRS" }}
                        </h1>
                        <p class="text-gray-500 text-sm mt-1">SCM / ADRS / Form</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <RouterLink to="/adrs"
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
                    <FormGroup label="Package SN" :required="true" :error="rules.issue_at"
                        errorMessage="Package SN is required">
                        <input type="text" id="issue_at" name="issue_at" v-model="package_sn"
                            :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                    <FormGroup label="Product Description" :required="true" :error="rules.issue_at"
                        errorMessage="Package Description is required">
                        <input type="text" id="issue_at" name="issue_at" v-model="package_desc"
                            :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                </div>
                <div class="flex justify-content-between gap-4 items-end mt-5">
                    <FormGroup class="w-full relative" label="product" :required="true">
                        <input type="text" autocomplete="off" name="product_name" id="product_name"
                            v-model="product_name" @input="filterProducts" class="rounded w-full"
                            placeholder="Type product name" :class="inputClass(rules.due_at)" />
                        <ul v-if="filteredProducts.length" class="border rounded w-full mt-2 bg-white absolute">
                            <li v-for="product in filteredProducts" :key="product.product_id"
                                @click="selectProduct(product)" class="p-2 cursor-pointer hover:bg-gray-200">
                                {{ product.product_sn }} - {{ product.product_desc }}
                            </li>
                        </ul>
                    </FormGroup>
                    <div class="" v-if="id">
                        <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg"
                            @click="addPoDetails">
                            tambah
                        </button>
                    </div>
                    <div class="" v-else>
                        <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg"
                            @click="addPoDetails">
                            tambah
                        </button>
                    </div>
                </div>
                <div class="mt-5">
                    <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
                        <thead>
                            <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                                <th class="px-3 py-2 font-semibold text-left border-b">Code</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">Product SN</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">Product Name</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">Action </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:text-gray-400">
                            <tr v-for="poDetail in package_details" :key="poDetail.product_id"
                                :class="{ 'bg-red-200': poDetail.quantity > poDetail.product_stock }">
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_code }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_pn }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_desc }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap text-center">
                                    <button type="button"
                                        class="border-gray-300 border-2 px-3 h-12 rounded-lg dark:text-gray-400"
                                        @click="package_details.splice(package_details.indexOf(poDetail), 1)">
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        </tbody>
                    </table>
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
import { PackageADRS, PackageADRSCode, Product, ProductCode } from '@/core/utils/url_api'
import router from '@/router'
import { useRoute } from 'vue-router'
import ApiServices from '@/core/services/ApiServices'

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
            id: null,
            products: [],
            product_id: [],
            product_name: '',
            filteredProducts: [],
            package_desc: '',
            package_sn: '',
            package_details: [],
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
        }
    },
    mounted() {
        const route = useRoute();
        const id = route.params.id;

        this.getProducts();

        if (id) {
            this.getById(id);
            this.id = id;
        }
    },

    methods: {
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

        getProducts() {
            axios.get(Product).then((res) => {
                var data = res.data
                this.products = data
            })
        },

        filterProducts() {
            const searchTerm = this.product_name.toLowerCase()
            this.filteredProducts = this.products.filter((product) => {
                const desc = product.product_desc.toLowerCase()
                const sn = product.product_sn.toLowerCase()
                return desc.includes(searchTerm) || sn.includes(searchTerm)
            })
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'IDR',
            }).format(value)
        },
        selectProduct(product) {
            this.product_id = product.product_id
            this.product_name = `${product.product_sn} - ${product.product_desc}`
            this.filteredProducts = []
        },
        addPoDetails() {
            if (this.product_id == '' || this.product_id == null) {
                Swal.fire({
                    icon: 'warning',
                    text: 'Pilih Barang',
                })
            } else {
                ApiServices.get(Product + '/' + this.product_id).then((res) => {
                    var data = res.data
                    if (this.quantity > data.product_stock) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning',
                            text: `Stock ${data.product_desc} Less Than Quantity`,
                        })
                        var object = {
                            product_id: data.product_id,
                            product_code: data.product_code,
                            product_pn: data.product_sn,
                            product_desc: data.product_desc,
                        }
                        this.package_details.push(object)
                    } else {
                        var object = {
                            product_id: data.product_id,
                            product_code: data.product_code,
                            product_pn: data.product_sn,
                            product_desc: data.product_desc,
                        }
                        this.package_details.push(object)
                    }
                    this.product_id = null
                    this.quantity = 0
                    this.price = 0
                })
            }
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

        async getDetails(data) {               
            for (let i = 0; i < data.length; i++) {
                var object = {
                    product_id: data[i].product.product_id,
                    product_code: data[i].product.product_code,
                    product_pn: data[i].product.product_sn,
                    product_desc: data[i].product.product_desc,
                }
                this.package_details.push(object)
            }
        },

        async getById(id) {
            await ApiServices.get(PackageADRS + '/' + id).then(
                (res) => {
                    var data = res.data[0];
                    this.package_desc = data.package_desc;
                    this.package_sn = data.package_sn;
                    var id_pack = data.detailpackage;
                    if (id_pack) {
                        this.getDetails(id_pack);
                    } else {
                        this.package_details = data.package_details;
                    }
                }
            )
        },

        async onSubmit() {
            const result = 2
            if (result != 0) {
                if (this.id == null) {
                    await ApiServices
                        .post(PackageADRSCode, {
                            package_desc: this.package_desc,
                            package_sn: this.package_sn,
                            package_details: this.package_details,
                        })
                        .then(
                            (response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Data has been Saved',
                                }).then((res) => {
                                    if (res.isConfirmed) {
                                        router.push('/adrs')
                                    }
                                })
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
                } else {
                    await ApiServices
                        .put(ProductCode + '/' + this.id, {
                            package_desc: this.package_desc,
                            package_sn: this.package_sn,
                            package_details: this.package_details,
                        })
                        .then(
                            (response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Data has been Saved',
                                }).then((res) => {
                                    if (res.isConfirmed) {
                                        router.push('/adrs')
                                    }
                                })
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