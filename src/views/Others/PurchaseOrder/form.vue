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
            <h1 class="text-2xl font-bold text-gray-800">Create New Purchase Order</h1>
            <p class="text-gray-500 text-sm mt-1">Others / Purchase Order / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/purchase-order"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
              <i class="fas fa-times"></i>
              Cancel
            </RouterLink>
            <button type="submit" :disabled="isSubmitting"
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Issue Date -->
          <FormGroup
            label="Issue Date"
            :required="true"
            :error="rules.issue_at"
            errorMessage="Issue Date is required"
          >
            <input
              type="date"
              id="issue_at"
              name="issue_at"
              v-model="issue_at"
              :class="inputClass(rules.issue_at)"
            />
          </FormGroup>

          <!-- Due Date -->
          <FormGroup
            label="Due Date"
            :required="true"
            :error="rules.due_at"
            errorMessage="Due Date is required"
          >
            <input
              type="date"
              id="due_at"
              name="due_at"
              v-model="due_at"
              :class="inputClass(rules.due_at)"
            />
          </FormGroup>
          <!-- No -->
          <FormGroup class="mt-5" label="Customer" :required="true" :error="rules.id_customer" errorMessage="Customer is Required">
            <select name="id_customer" id="id_customer" v-model="id_customer" class="rounded w-full">              
              <option v-for="customer in customers" :key="customers.id_customer" :value="customer.id_customer">
                {{ customer.customer_name }}
              </option>                
            </select>
          </FormGroup>          
          <!-- Code PO -->
          <FormGroup
          class="mt-5"
            label="Payment Type"
            :required="true"
            :error="rules.id_payment_type"
            errorMessage="Payment Type is Required"
          >
          <select name="id_payment_type" id="id_payment_type" v-model="id_payment_type" class="rounded w-full">              
              <option v-for="payment in payment_types" :key="payment.id_payment_type" :value="payment.id_payment_type">
                {{ payment.payment_type }}
              </option>                
            </select>            
          </FormGroup>

          <!-- PO Type -->
          <FormGroup
            label="Bank Account"
            :required="true"
            :error="rules.id_bank_account"
            errorMessage="Bank Account is required"
          >
          <select 
            id="id_bank_account"
            name="id_bank_account" 
            v-model="id_bank_account" 
            class="rounded w-full">              
              <option v-for="bank_account in bank_accounts" :key="bank_account.id_bank_account" :value="bank_account.id_bank_account">
                {{ bank_account.bank_name }} - {{ bank_account.account_name }}
              </option>                
            </select>             
          </FormGroup>

          <!-- Status Payment -->
          <FormGroup
            label="Po Type"
            :required="true"
            :error="rules.po_type"
            errorMessage="PO Type is required"
          >
            <select 
              id="po_type"
              name="po_type" 
              v-model="po_type" 
              class="rounded w-full">              
              <option value="type1">Bayar di Muka</option>              
              <option value="type2">Termin 50%</option>
              <option value="type3">Termin 20%</option>
            </select> 
          </FormGroup>          

          <!-- Total Tax -->
          <FormGroup
            label="Total Service"
            :required="true"
            :error="rules.total_service"
            errorMessage="Total Service is required"
          >
            <input
              type="number"
              id="total_service"
              name="total_service"
              v-model="total_service"
              :class="inputClass(rules.total_service)"
              placeholder="Enter Total Service"
            />
          </FormGroup>

          <!-- Total Service -->
          <FormGroup
            label="Deposit"
            :required="true"
            :error="rules.deposit"
            errorMessage="Deposit is required"
          >
            <input
              type="number"
              id="deposit"
              name="deposit"
              v-model="deposit"
              :class="inputClass(rules.deposit)"
              placeholder="Enter Deposit"
            />
          </FormGroup>

          <!-- Deposit -->
          <FormGroup>            
          </FormGroup>                             
        </div>
        <div class="flex justify-content-between gap-4 items-end">
          <FormGroup class="w-full" label="product" :required="true" :error="rules.product_id" errorMessage="product_id is required">
            <select 
            id="product_id"product
            name="product_id" 
            v-model="id_product" 
            class="rounded w-full">              
              <option v-for="product in products" :key="product.id_product" :value="product.id_product">
                {{ product.product_name }}
              </option>                
            </select> 
          </FormGroup>

          <!-- Grand Total -->
          <FormGroup
            class="w-full" 
            label="Quantity"
            :required="true"
            :error="rules.quantity"
            errorMessage="Quantity is required"
          >
            <input
              type="number"
              id="quantity"
              name="quantity"
              v-model="quantity"
              :class="inputClass(rules.quantity)"
              placeholder="Enter Quantity"              
            />
          </FormGroup>
          <FormGroup
            class="w-full" 
            label="Price"
            :required="true"
            :error="rules.quantity"
            errorMessage="Price is required"
          >
            <input
              type="number"
              id="quantity"
              name="quantity"              
              :class="inputClass(rules.quantity)"
              placeholder="Enter Quantity"              
            />
          </FormGroup> 
          <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg" @click="addPoDetails">tambah</button>
        </div>
        <div class=" mt-5">
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
          <thead>
            <tr class="text-left">
              <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">#</th>
              <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Product Name</th>              
              <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Quantity</th>
              <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Product Price</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="poDetail in purchase_order_details" :key="poDetail.id_product">
              <td class="px-3 py-2 whitespace-no-wrap">
                <button class="bg-red-300 p-2 px-5 rounded-lg">Delete</button>
              </td>
              <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.name }}</td>              
              <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.quantity }}</td>              
              <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.price }}</td>
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
import Swal from 'sweetalert2';
import Notification from '@/components/Notification.vue';
import FormGroup from '@/components/FormGroup.vue';
import axios from 'axios';
import { BankAccount, Customer, PaymentTypes, Product } from '@/core/utils/url_api';

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
      customers: [],
      payment_types : [],
      bank_accounts : [],
      products : [],
      id_product: [],
      quantity : [],
      id_customer: null,
      id_payment_type: null,
      id_bank_account: null,
      po_type: "",
      status_payment: "Hasn't Payed",
      total_tax: 0,
      total_service: 0,
      deposit: 0,
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        id_customer : false,
        id_payment_type: false,
        id_bank_account: false,
        po_type: false,
        status_payment: false,
        total_tax: false,
        total_service: false,
        deposit: false,
      },
      purchase_order_details : [],
    }
  },
  async mounted() {
    this.getCustomer();
    this.getPaymentTypes();
    this.getBankAccount();
    this.getProducts();
  },

  methods: {
    getCustomer() {
      axios.get(Customer).then((res) => {
        var data = res.data;
        this.customers = data;
      })
    },
    getPaymentTypes(){
      axios.get(PaymentTypes).then((res) => {
        var data = res.data;
        this.payment_types = data;
      })
    },
    getBankAccount(){
      axios.get(BankAccount).then((res) => {
        var data = res.data;
        this.bank_accounts = data
      })
    },
    getProducts(){
      axios.get(Product).then((res) => {
        var data = res.data;
        this.products = data
      })
    },

    addPoDetails(){
      axios
        .get(Product + '/' + this.id_product)
        .then((res) => { 
          var data = res.data;          
          var object = {
            id_product : data.id_product,
            name : data.product_name,
            quantity : this.quantity,
            price : data.product_price,                        
          };
          this.purchase_order_details.push(object)            
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

    validation() {
      let isValid = true

      // Reset all rules first
      Object.keys(this.rules).forEach((key) => {
        this.rules[key] = false
      })

      // Validate fields
      Object.keys(this.form).forEach((key) => {
        if (!this.form[key]?.toString().trim()) {
          this.rules[key] = true
          isValid = false
        }
      })

      return isValid
    },

    async onSubmit() {
      console.log(this.id_customer);
      if (this.isSubmitting) return

      const isValid = this.validation()

      if (!isValid) {
        this.showNotification('error', 'Please fill in all required fields correctly')
        return
      }

      this.isSubmitting = true

      try {
        const purchaseOrderData = { ...this.form }

        console.log('Submitting purchase order data:', purchaseOrderData)
        // Add your API call here

        this.showNotification('success', 'Purchase order created successfully')
      } catch (error) {
        console.error('Error creating purchase order:', error)
        this.showNotification('error', 'Failed to create purchase order. Please try again.')
      } finally {
        this.isSubmitting = false
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
