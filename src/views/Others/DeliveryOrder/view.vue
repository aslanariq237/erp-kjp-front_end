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
                        <h1 class="text-2xl font-bold text-gray-800">Detail View Delivery Order</h1>
                        <p class="text-gray-500 text-sm mt-1">Sales / Delivery Order / View</p>
                    </div>
                    <div class="flex items-center gap-3">
                        <RouterLink to="/delivery-order"
                            class="px-4 py-2 bg-red-400 rounded-lg hover:bg-red-500 transition-colors duration-200 flex items-center gap-2 text-white">
                            <i class="fas fa-times"></i>
                            Back
                        </RouterLink>
                    </div>
                </div>
            </div>

            <!-- Form Card -->
            <div class="bg-white rounded-lg shadow-md p-6">                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    <!-- Termin -->
                    <FormGroup label="Sales Order Number" :required="true" :error="rules.po_type"
                        errorMessage="PO Type is required">
                        <input type="text" id="point" name="point" v-model="code_do" disabled
                            :class="inputClass(rules.point)" />
                    </FormGroup>

                    <FormGroup label="Issue Date" :required="true" :error="rules.issue_at"
                        errorMessage="Issue Date is required">
                        <input type="date" id="point" name="point" v-model="issue_at" disabled
                            :class="inputClass(rules.point)" />
                    </FormGroup>                    

                    <!-- Due Date -->
                    <FormGroup label="Delivery Point" :required="true" :error="rules.point"
                        errorMessage="Due Date is required">
                        <input type="text" id="point" name="point" v-model="point" disabled
                            :class="inputClass(rules.point)" />
                    </FormGroup>
                    <!-- No -->
                    <FormGroup label="Customer Name" :required="true" :error="rules.customer_id"
                        errorMessage="Customer is Required">
                        <input type="text" id="point" name="point" v-model="customer_name" disabled
                            :class="inputClass(rules.point)" />
                    </FormGroup>
                    <!-- Code PO -->
                    <!-- <FormGroup label="Employee" :required="true" :error="rules.id_payment_type"
                        errorMessage="Employee is Required">
                        <input type="text" id="point" name="point" v-model="employee_name" disabled
                            :class="inputClass(rules.point)" />
                    </FormGroup> -->
                </div>
                <div class=" mt-5">
                    <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
                        <thead>
                            <tr class="text-left">
                                <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Code</th>
                                <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">PN</th>
                                <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Product Name</th>                                
                                <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Quantity</th>                                
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-for="poDetail in sales_orders_details" :key="poDetail.product_id">
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product.product_code }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product.product_sn }}</td>
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product.product_desc }}</td>                                
                                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.quantity }}</td>                                
                            </tr>
                        </tbody>
                    </table>
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
import { DetailSo, DeliveryOrder, DetailDo } from '@/core/utils/url_api';
import { useRoute } from 'vue-router';

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
            code_do: '',
            customer_name: '',
            employee_name: '',                                
            termin: "",
            po_type: "",    
            issue_at: '',
            point: '',    
            sub_total : 0,        
            sales_orders_details : [],
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
            axios.get(DeliveryOrder + '/' + id).then(
                (res) => {
                    var data = res.data;                             
                    this.issue_at = data.issue_at;
                    this.point = data.point.point;
                    this.termin = data.termin
                    this.customer_name = data.customer.customer_name;                                                                                                                                 
                    this.sub_total = data.sub_total;
                    this.code_do = data.code_do;
                }
            )            
        },
        getDetail(id){
            axios.get(DetailDo + '/' + id).then(
                (res) => {
                    var data = res.data;
                    this.sales_orders_details = data;
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