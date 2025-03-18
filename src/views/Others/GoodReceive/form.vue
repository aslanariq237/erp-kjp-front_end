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
            <h1 class="text-2xl font-bold text-gray-800">Good Receive</h1>
            <p class="text-gray-500 text-sm mt-1">SCM / Good Receive / Add</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/good-receive"
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Issue Date -->
          <FormGroup label="Issue Date" :required="true" :error="rules.issue_at" errorMessage="Issue Date is required">
            <input type="date" id="issue_at" name="issue_at" v-model="issue_at" :class="inputClass(rules.issue_at)" disabled/>
          </FormGroup>

          <!-- Termin -->
          <FormGroup label="Termin" :required="true" :error="rules.po_type" errorMessage="PO Type is required">
            <input type="text" id="due_at" name="due_at" v-model="termin" :class="inputClass(rules.due_at)" disabled/>                          
          </FormGroup>

          <!-- Due Date -->
          <FormGroup label="Due Date" :required="true" :error="rules.due_at" errorMessage="Due Date is required">
            <input type="date" id="due_at" name="due_at" v-model="due_at" :class="inputClass(rules.due_at)" disabled/>
          </FormGroup>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <!-- No -->
          <FormGroup label="Vendor" class="relative" :required="true" :error="rules.vendor_id"
            errorMessage="vendor is Required">
            <input type="text" name="vendor_name" id="vendor_name" v-model="vendor_name" disabled
              class="rounded w-full" placeholder="Type Vendor Name" />            
          </FormGroup>

          <!-- Total Service -->
          <FormGroup label="Deposit" :required="true" :error="rules.deposit" errorMessage="Deposit is required">
            <input type="number" id="deposit" name="deposit" v-model="deposit" :class="inputClass(rules.deposit)" disabled
              placeholder="Enter Deposit"/>
          </FormGroup>

          <!-- Deposit -->
          <FormGroup> </FormGroup>
        </div>                         
        <div class="">
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
            <thead>
              <tr class="text-left">                                                
                <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Product Name</th>                                                                
                <th class="px-3 py-2 font-semibold text-center bg-gray-100 border-b">Quantity Received</th>
                <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">
                  Price
                </th>
                <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="poDetail in purchase_order_details" :key="poDetail.product_id">                                
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_desc }}</td>                              
                <td class="px-3 py-2 whitespace-no-wrap text-center">
                  <input 
                    type="number" 
                    name="quantity" 
                    id="quantity" 
                    v-model="poDetail.quantity_left"
                    class="w-15 rounded-lg text-center"
                    @change="changeQuantity(poDetail)"
                  >
                </td>
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
              <div class="sub_total flex justify-between mt-3">
                <p>PPN</p>
                <p>{{ formatCurrency(ppn) }}</p>
              </div>
              <div class="sub_total flex justify-between mt-3">
                <p>Grand Total</p>
                <p>{{ formatCurrency(grand_total) }}</p>
              </div>
            </div>
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
import axios from 'axios'
import {
  Employee,
  Product,  
  Vendor,
  PurchaseOrder,
  DetailPo
} from '@/core/utils/url_api'
import { useRoute } from 'vue-router'
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
      id_po: 0,      
      vendor_name: '',      
      employee_name: '',      
      product_name: '',                        
      price: 0,
      issue_at: '',
      due_at: '',
      isSubmitting: false,
      purchase_order_details: [],
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        vendor_id: false,
        id_payment_type: false,
        id_bank_account: false,
        po_type: false,
        status_payment: false,        
        total_tax: false,
        total_service: false,
        deposit: false,
      },      
    }
  },
  async mounted() {
    const route = useRoute()
    const id = route.params.id;

    if (id) {
      this.getById(id);
      this.getDetail(id); 
      this.id_po = id;
    }    

  },

  computed: {    
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.purchase_order_details.reduce((total, item) => {
        return total + (item.amount) || 0
      }, 0);
    },

    // Calculate PPN (11% of subtotal)
    ppn() {
      return this.sub_total * 0.11
    },

    // Calculate grand total (subtotal + PPN)
    grand_total() {
      return this.sub_total + this.ppn
    },
  },
  methods: {        
    getById(id) {
      axios.get(PurchaseOrder + '/' + id).then(
        (res) => {
          var data = res.data;
          this.issue_at = data.issue_at;
          this.due_at = data.due_at;
          this.termin = data.termin;
          this.deposit = data.deposit;
          this.vendor_name = data.vendor.vendor_name;
          this.employee_name = data.employee.employee_name;          
          this.code_po = data.code_po;
        }
      )
    },
    getDetail(id) {
      axios.get(DetailPo + '/' + id).then(
        (res) => {
          var data = res.data
          for (let i = 0; i < data.length; i++) {
            var object = {
              id_detail_po: data[i].id_detail_po,
              product_id: data[i].product_id,
              product_desc: data[i].product.product_desc,              
              quantity_left: data[i].quantity - data[i].quantity_left,
              quantity: data[i].quantity,
              price: data[i].price,
              amount: data[i].amount,
            }
            this.purchase_order_details.push(object)
          }
        }
      )
    },
    changeQuantity(poDetail){      
      poDetail.amount = poDetail.price * poDetail.quantity;
      if (poDetail.quantity <= poDetail.quantity_left) {
        poDetail.quantity_left = poDetail.quantity;
      }
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
      var count = 2

      return count
    },

    async onSubmit() {
      const result = 2;                           
      if (result != 0) {
        await axios
          .post(PurchaseOrder + '/good-receive', {                                  
            id_po: this.id_po,
            purchase_order_details: this.purchase_order_details,
          })
          .then(
            (response) => {
              console.log(response)
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data has been Saved',
              }).then(async (result) => {
                if (result.isConfirmed) {                  
                  await router.push('/good-receive')                  
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
