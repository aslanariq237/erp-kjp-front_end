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
                        <h1 class="text-2xl font-bold text-gray-800">Create New Product</h1>
                        <p class="text-gray-500 text-sm mt-1">Master Data / Product / Form</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <RouterLink to="/product"
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
                    <FormGroup label="Image Product" :required="false" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="file" autocomplete="off" id="issue_at" name="issue_at"
                            :class="inputClass(rules.issue_at)" />
                    </FormGroup>

                    <FormGroup label="Product Desc" :required="true" :error="rules.product_desc"
                        errorMessage="Product Desc is required">
                        <input type="text" autocomplete="off" id="product_desc" name="product_desc"
                            v-model="product_desc" :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                    <FormGroup label="Product SN" :required="true" :error="rules.product_sn"
                        errorMessage="Product Sn is required">
                        <input type="text" id="issue_at" autocomplete="off" name="issue_at" v-model="product_sn"
                            :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                    <FormGroup label="Product Brand" :required="false" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="text" id="product_brand" autocomplete="off" name="product_brand"
                            v-model="product_brand" :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                    <FormGroup label="Product UoM" :required="false" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="text" id="issue_at" autocomplete="off" name="issue_at" v-model="product_uom"
                            :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                    <FormGroup label="Product Category" :required="false" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="text" id="issue_at" autocomplete="off" name="issue_at"
                            v-model="product_category_id" :class="inputClass(rules.issue_at)" />
                    </FormGroup>
                </div>
            </div>
            <div
                class="relative bg-white rounded-xl shadow-lg p-6 mt-3 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
                <div class="flex space-x-4 items-center">
                    <input type="checkbox" name="is_package" id="is_package" v-model="is_package"
                        :checked="is_package == 1" />
                    <span>is package</span>
                </div>
                <div v-if="is_package == true">
                    <div class="flex space-x-5 items-end md:flex-row mt-4 justify-between">
                        <FormGroup class="w-full relative" label="Product" :required="true" :error="rules.product_id"
                            errorMessage="Pilih produk">
                            <input type="text" name="product_name" id="product_name" v-model="product_name"
                                autocomplete="off" @input="filterProducts" :class="inputClass(rules.product_id) + ' focus:ring-green-500 focus:border-green-500'
                                    " placeholder="Type product name" />
                            <ul v-if="filteredProducts.length && product_name"
                                class="absolute z-40 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600">
                                <li v-for="product in filteredProducts" :key="product.product_id"
                                    @click="selectProduct(product)"
                                    class="p-3 cursor-pointer hover:bg-green-100 dark:hover:bg-gray-600 transition-colors duration-150 text-gray-800 dark:text-gray-200">
                                    {{ product.product_sn }} - {{ product.product_desc }}
                                </li>
                                <li v-if="filteredProducts.length === 0 && product_name"
                                    class="p-3 text-gray-500 italic">
                                    Tidak ada produk yang cocok.
                                </li>
                            </ul>
                        </FormGroup>
                        <div class="">
                            <button type="button"
                                class="w-full flex items-center justify-center px-6 py-2 gap-2 bg-white text-green-600 border border-green-500 font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-colors duration-300 ease-in-out shadow-md"
                                @click="ProductList">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clip-rule="evenodd"></path>
                                </svg>
                                Tambah
                            </button>
                        </div>
                    </div>
                    <div class="mt-8 overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-100 dark:bg-gray-700">
                                <tr class="text-center">
                                    <th
                                        class="px-4 py-3 font-semibold text-left text-xs text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                        No
                                    </th>
                                    <th
                                        class="px-4 py-3 font-semibold text-left text-xs text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                        PN
                                    </th>
                                    <th
                                        class="px-4 py-3 font-semibold text-left text-xs text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                        Product Desc
                                    </th>
                                    <th
                                        class="px-4 py-3 font-semibold text-right text-xs text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                        Product Brand
                                    </th>
                                    <th
                                        class="px-4 py-3 font-semibold text-right text-xs text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                        Product Uom
                                    </th>
                                    <th
                                        class="px-4 py-3 font-semibold text-center text-xs text-gray-700 uppercase tracking-wider dark:text-gray-300">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                <tr v-for="(poDetail, index) in package_details" :key="index"
                                    class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        {{ index + 1 }}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        {{ poDetail.product ? poDetail.product.product_sn : poDetail.product_sn }}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                        {{ poDetail.product ? poDetail.product.product_desc : poDetail.product_desc }}
                                    </td>
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-center">
                                        {{ poDetail.product ? poDetail.product.product_brand : poDetail.product_brand }}
                                    </td>
                                    <td
                                        class="px-4 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-right">
                                        {{ poDetail.product ? poDetail.product.product_uom : poDetail.product_uom }}
                                    </td>
                                    <td class="px-4 py-3 whitespace-nowrap text-center">
                                        <button type="button"
                                            class="text-red-600 hover:text-red-800 font-semibold px-3 py-1 rounded-md transition-colors duration-200"
                                            @click="package_details.splice(package_details.indexOf(poDetail))">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td v-if="package_details == 0" colspan="7"
                                        class="px-4 py-4 text-center text-gray-500 italic dark:text-gray-400">
                                        Belum ada produk ditambahkan.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
import { Product, ProductCode } from '@/core/utils/url_api'
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
            product_desc: '',
            product_sn: '',
            product_brand: '',
            product_uom: '',
            product_category_id: '',
            product_stock: 0,
            products: [],
            product_id: null,
            package_details: [],
            detail_pacakges: [],
            is_package: false,
            filteredProducts: [],
            //others
            isSubmitting: false,
            notification: {
                show: false,
                type: 'success',
                message: '',
            },
            rules: {
                product_desc: false,
                product_sn: false,
                product_brand: false,
                product_uom: false,
                product_category_id: false,
                product_image: false,
            },
            sales_order_details: [],
        }
    },
    mounted() {
        const route = useRoute();
        const id = route.params.id;
        this.getProduct();

        if (id) {
            this.getById(id);
            this.id = id;
        }
    },

    methods: {
        getProduct() {
            ApiServices.get(Product).then((res) => {
                var data = res.data
                this.products = data
            })
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

            if (this.product_desc == '' || this.product_desc == null) {
                this.rules.product_desc = true
                count++
            } else {
                this.rules.product_desc = false
            }

            if (this.product_sn == '' || this.product_sn == null) {
                this.rules.product_sn = true
                count++
            } else {
                this.rules.product_sn = false
            }

            if (this.is_package == true) {
                if (this.package_details.length == 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Tambahkan Barang'
                    });
                }
            }

            return count
        },
        filterProducts() {
            const searchTerm = this.product_name.toLowerCase()
            this.filteredProducts = this.products.filter((product) => {
                const desc = (product.product_desc || '').toLowerCase();
                const pn = (product.product_sn || '').toLowerCase();
                return desc.includes(searchTerm) || pn.includes(searchTerm);
            })
        },

        selectProduct(product) {
            this.product_id = product.product_id
            this.product_name = `${product.product_sn} - ${product.product_desc}`
            this.filteredProducts = []
        },

        ProductList() {
            var selected = this.products.find(
                function (item) {
                    return item.product_id == this.product_id
                }.bind(this),
            )
            if (selected) {
                this.package_details.push({
                    product_id: selected.product_id,
                    product_desc: selected.product_desc,
                    product_sn: selected.product_sn,
                    product_brand: selected.product_brand,
                    product_uom: selected.product_uom,
                })
            }
        },

        getById(id) {
            ApiServices.get(Product + '/' + id).then(
                (res) => {
                    var data = res.data;
                    if (Array.isArray(data)) {
                        data = data[0];
                    }
                    this.product_desc = data.product_desc;
                    this.product_category_id = data.product_category_id;
                    this.product_brand = data.product_brand;
                    this.product_sn = data.product_sn;
                    this.product_code = data.product_code;
                    this.product_uom = data.product_uom;
                    this.is_package = data.is_package;
                    this.detail_pacakges = data.detail_package || [];
                    if (data.is_package == 1) {
                        this.getDetail();
                    }
                }
            )
        },
        getDetail() {
            this.package_details = [];
            this.detail_pacakges.forEach((item) => {
                if (item.product) {
                    this.package_details.push({
                        product_id: item.product.product_id,
                        product_desc: item.product.product_desc,
                        product_sn: item.product.product_sn,
                        product_brand: item.product.product_brand,
                        product_uom: item.product.product_uom
                    });
                }
            })
        },
        async onSubmit() {
            const result = await this.validation();
            if (result == 0) {
                if (this.id == null) {
                    await ApiServices
                        .post(ProductCode, {
                            product_desc: this.product_desc,
                            product_sn: this.product_sn,
                            product_brand: this.product_brand,
                            product_uom: this.product_uom,
                            product_category_id: this.product_category_id,
                            product_stock: this.product_stock,
                            is_package: this.is_package,
                            package_details: this.package_details
                        })
                        .then(
                            (response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Data has been Saved',
                                }).then((res) => {
                                    if (res.isConfirmed) {
                                        router.push('/product')
                                    }
                                })
                            },                            
                        ).catch((error) => {
                            if (error.response && error.response.data) {
                                Swal.fire({
                                    icon: 'error',
                                    text: error.response.data.error
                                })
                            } else {
                                alert('Terjadi kesalahan pada server')
                            }
                        })
                } else {
                    await ApiServices
                        .put(ProductCode + '/' + this.id, {
                            product_desc: this.product_desc,
                            product_sn: this.product_sn,
                            product_brand: this.product_brand,
                            product_uom: this.product_uom,
                            product_category_id: this.product_category_id,
                            product_stock: this.product_stock,
                            is_package: this.is_package,
                            package_details: this.package_details
                        })
                        .then(
                            (response) => {
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Success',
                                    text: 'Data has been Saved',
                                }).then((res) => {
                                    if (res.isConfirmed) {
                                        router.push('/product')
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