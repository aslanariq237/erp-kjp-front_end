<template>
    <AdminLayout>
        <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
            <!-- Notification -->
            <Notification 
                v-if="notification.show" 
                :type="notification.type" 
                :message="notification.message"
                @close="notification.show = false" 
            />

            <!-- Header Card -->
            <div class="bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-gray-400">
                <div class="flex justify-between items-center p-6 border-b">
                    <div class="breadcrumb">
                        <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Detail View Quatation</h1>
                        <p class="text-gray-400 text-sm mt-1">Others / Quatation / View</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <RouterLink 
                            to="/quotation"
                            class="px-4 py-2 bg-red-400 rounded-lg hover:bg-red-500 transition-colors duration-200 flex items-center gap-2 text-white">
                            <i class="fas fa-times"></i>
                            Back
                        </RouterLink>
                    </div>
                </div>
            </div>

            <!-- Form Card -->
            <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:text-gray-400">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <!-- Issue Date -->
                    <FormGroup label="Issue Date" :required="true" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="date" id="due_at" name="due_at" v-model="issue_at"
                            :class="inputClass(rules.due_at)" />
                    </FormGroup>

                    <!-- Termin -->
                    <FormGroup label="Term of Payment" :required="true" :error="rules.po_type"
                        errorMessage="PO Type is required">
                        <input type="text" id="due_at" disabled name="due_at" v-model="termin"
                            :class="inputClass(rules.due_at)" />
                    </FormGroup>

                    <!-- Due Date -->
                    <FormGroup label="Due Date" :required="true" :error="rules.due_at"
                        errorMessage="Due Date is required">
                        <input type="date" disabled id="due_at" name="due_at" v-model="due_at"
                            :class="inputClass(rules.due_at)" />
                    </FormGroup>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    <!-- No -->
                    <FormGroup class="mt-5" label="Customer" :required="true" :error="rules.customer_id"
                        errorMessage="Customer is Required">
                        <input type="text" disabled id="due_at" name="due_at" v-model="customer_name"
                            :class="inputClass(rules.due_at)" />
                    </FormGroup>
                    <!-- Code PO -->
                    <FormGroup class="mt-5 dark:text-gray-400" label="Quotation Number" :required="true"
                        :error="rules.id_payment_type" errorMessage="Employee is Required">
                        <input type="text" disabled id="due_at" name="due_at" v-model="code_quatation"
                            :class="inputClass(rules.due_at)" />
                    </FormGroup>                    
                </div>
                <FormGroup label="Note" class="relative w-full mt-4 border-gray-500" :required="true"
                        :error="rules.customer_id">
                        <textarea name="note" disabled id="note" cols="30" class="rounded-md w-full border-gray-500"
                            v-model="description">
                        </textarea>
                    </FormGroup>
                <div class=" mt-5">
                    <table
                        class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border dark:bg-gray-800 dark:text-gray-400">
                        <thead>
                            <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                                <th class="px-3 py-2 font-semibold text-left border-b">Code</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">PN</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">Product Name</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">Quantity</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">Price</th>
                                <th class="px-3 py-2 font-semibold text-left border-b">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:text-gray-400">
                            <tr v-for="poDetail in quatation_details" :key="poDetail.product_id">
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product.product_code }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product.product_sn }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product.product_desc }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.quantity }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.price) }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.amount) }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="flex justify-between mt-5">
                        <div class="w-full"></div>
                        <div class="w-full"></div>
                        <div class="w-full">
                            <div class="sub_total flex justify-between mt-3">
                                <p>Sub Total</p>
                                <p>{{ formatCurrency(sub_total) }}</p>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </AdminLayout>
</template>

<script>
import { defineComponent } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Notification from '@/components/Notification.vue';
import FormGroup from '@/components/FormGroup.vue';
import axios from 'axios';
import { DetailQuatation, Quatations } from '@/core/utils/url_api';
import { useRoute } from 'vue-router';
import ApiServices from '@/core/services/ApiServices';

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
            customer_name: '',
            employee_name: '',
            termin: "",
            po_type: "",
            issue_at: '',
            due_at: '',
            code_quatation: '',
            sub_total: 0,
            ppn: 0,
            grand_total: 0,
            description: '',
            quatation_details: [],
            isSubmitting: false,
            notification: {
                show: false,
                type: 'success',
                message: '',
            },
            rules: {
                customer_id: false,
                id_payment_type: false,
                id_bank_account: false,
                po_type: false,
                status_payment: false,
                total_tax: false,
                total_service: false,
                deposit: false,
            },
            inquiry_details: [],
        }
    },
    async mounted() {
        const route = useRoute();
        const id = route.params.id;

        if (id) {
            this.getById(id)
            this.getDetail(id)
        }
    },
    methods: {
        getById(id) {
            ApiServices.get(Quatations + '/' + id).then(
                (res) => {
                    var data = res.data[0];
                    this.issue_at = data.issue_at;
                    this.due_at = data.due_at;
                    this.termin = data.termin;
                    this.description = data.description;
                    this.customer_name = data.customer.customer_name;
                    this.employee_name = data.employee.employee_name;
                    this.sub_total = data.sub_total;
                    this.code_quatation = data.code_quatation;
                    this.ppn = data.ppn;
                }
            )
        },
        getDetail(id) {
            ApiServices.get(DetailQuatation + '/' + id).then(
                (res) => {
                    var data = res.data;
                    this.quatation_details = data;
                }
            )
        },
        formatCurrency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'IDR',
            }).format(value)
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
            var count = 0;

            if (this.customer_id == "" || this.customer_id == null) {
                this.rules.customer_id = true;
                count++
            } else {
                this.rules.customer_id = false;
            }

            return count
        },

        inputClass(error) {
            return [
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200 dark:bg-gray-800 dark:text-gray-400',
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