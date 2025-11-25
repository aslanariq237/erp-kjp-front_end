<template>
    <AdminLayout>
      <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
        <!-- Notification -->
        <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
          @close="notification.show = false" />
  
        <!-- Header Card -->
        <div class="bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-gray-400">
          <div class="flex justify-between items-center p-6 border-b">
            <div class="breadcrumb">
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">View Tanda Terima</h1>
              <p class="text-gray-500 text-sm mt-1">Sales / Tanda Terima / Form</p>
            </div>
            <div class="flex items-center gap-3">
              <RouterLink to="/tanda-terima"
                class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
                <i class="fas fa-times"></i>
                Cancel
              </RouterLink>             
            </div>
          </div>
        </div>
  
        <!-- Form Card -->
        <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:text-gray-400">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Issue Date -->
            <FormGroup label="Issue Date" :required="true" :error="rules.issue_at" errorMessage="Issue Date is required">
              <input type="date" id="issue_at" name="issue_at" v-model="issue_at" :class="inputClass(rules.issue_at)" />
            </FormGroup>
  
            <!-- Due Date -->
            <FormGroup label="Resi" :required="true" :error="rules.due_at" errorMessage="Due Date is required">
              <input type="text" id="due_at" name="due_at" placeholder="Input Resi" v-model="resi" :class="inputClass(rules.due_at)" />
              <div class="" v-if="rules.resi == true">
                <p class="text-red-500 text-sm">Resi Dibutuhkan</p>
              </div>
            </FormGroup>            
            <!-- DO Type -->
            <FormGroup label="Customer name" :required="true" :error="rules.customer" errorMessage="DO Type is required">
              <input type="text" v-model="customer_id" hidden>
              <input type="text" id="do_type" name="do_type" v-model="customer_name" :class="inputClass(rules.do_type)"
                placeholder="Customer Name" />
            </FormGroup>
            <!-- Alamat -->
            <FormGroup label="Address" :required="false" errorMessage="Sub Total is required">
              <input type="text" id="alamat" name="alamat" v-model="customer_address" :class="inputClass(rules.alamat)"
                placeholder="Enter Address" />
            </FormGroup>
            <FormGroup>
            </FormGroup>
          </div>          
          <div class=" mt-8">
            <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
              <thead>
                <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                  <th class="px-3 py-2 font-semibold text-left border-b">No</th>
                  <th class="px-3 py-2 font-semibold text-left border-b">Invoice Number</th>
                  <th class="px-3 py-2 font-semibold text-left border-b">So Number</th>
                  <th class="px-3 py-2 font-semibold text-left border-b">Po Number</th>                
                  <th class="px-3 py-2 font-semibold text-left border-b">Nominal</th>                
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:text-gray-400">
                <tr v-for="(products, index) in tandaterima_details" :key="index">
                  <td class="px-3 py-2 whitespace-no-wrap">{{ index+1 }}</td>                
                  <td class="px-3 py-2 whitespace-no-wrap">{{ products.code_invoice }}</td>                
                  <td class="px-3 py-2 whitespace-no-wrap">{{ products.code_so }}</td>                
                  <td class="px-3 py-2 whitespace-no-wrap">{{ products.po_number }}</td>                
                  <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(products.nominal) }}</td>                
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
  import { Form } from 'vee-validate'
  import { RouterLink, useRoute } from 'vue-router'
  import Notification from '@/components/Notification.vue'
  import FormGroup from '@/components/FormGroup.vue'
  import {
    DetailTandater,
    Tandater,
  } from '@/core/utils/url_api'
  import router from '@/router'
import ApiServices from '@/core/services/ApiServices'
  
  export default defineComponent({
    name: 'DeliveryOrderForm',
    components: {
      AdminLayout,
      Form,
      Notification,
      FormGroup,
    },
  
    data() {
      return {
        id: null,
        salesOrders: [],
        deliveryOrders: [],
        employee: [],
        tandaterima_details: [],      
        code_invoice: '',
        code_tandaterima: '',
        id_so: null,
        id_invoice: null,
        customer_id: null,
        employee_id: null,
        po_number: '',
        resi : '',      
        customer_name: '',
        customer_npwp: 0,
        customer_address: '',
        employee_name: '',
        checklist_prod: 0,
        issue_at: '',
        due_at: '',
        isSubmitting: false,
        rules: {
          resi: false,
          tandaterima_details : false,
        },
        notification: {
          show: false,
          type: 'success',
          message: '',
        },
        rules: {
  
        },
      }
    },
    async mounted() {
      const route = useRoute();
      const id = route.params.id;
      this.total = this.sub_total;      
      if (id) {
        this.getById(id);
        this.id = id;
      } else {
        this.issue_at = new Date().toLocaleDateString('en-CA');
      }
    },
    computed: {
      // Calculate subtotal based on all items in sales_order_details
      sub_total() {
        return this.tandaterima_details.reduce((total, item) => {
          return total + (item.amount) || 0
        }, 0);
      },
    },
    methods: {
      changeQuantity(products) {
        products.amount = products.price * products.quantity;
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
  
      getDetailSo(id) {
        ApiServices.get(DetailTandater + '/' + id).then(
          (res) => {
            var data = res.data;
            for (let i = 0; i < data.length; i++) {
              var object = {
                id_tandater : data[i].id_tandater,
                code_invoice : data[i].invoice.code_invoice,
                code_so : data[i].so.code_so,
                po_number : data[i].so.po_number,
                nominal : data[i].invoice.grand_total,                
              }
              this.tandaterima_details.push(object);
            }
          }
        )
      },
      async getById(id) {
        await ApiServices.get(Tandater + '/' + id).then(          
          (res) => {
            var data = res.data;
            this.customer_name = data[0].customer.customer_name;            
            this.customer_address = data[0].customer.customer_address;
            this.issue_at = data[0].issue_at;
            this.resi = data[0].resi;
            var id = data[0].id_tandater;

            if (id) {
              this.getDetailSo(id);
            }
          }
        )
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
  <style scoped></style>