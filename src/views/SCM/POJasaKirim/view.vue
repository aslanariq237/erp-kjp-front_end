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
          <div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">{{ id? "View Purchase Order Jasa Kirim" : "" }}</h1>
            <p class="text-gray-500 text-sm mt-1">SCM / Purchase Order Jasa Kirim / Form</p>
          </div>          
          <div class="flex items-center gap-3">
            <RouterLink
              to="/po-jasa-kirim"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
            >
              <i class="fas fa-times"></i>
              Cancel
            </RouterLink>            
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Issue Date -->
          <FormGroup label="Issue Date" :required="true">
            <input
              type="date"
              id="issue_at"
              name="issue_at"
              v-model="issue_at"
              :class="inputClass(rules.issue_at)"
            />
            <div class="" v-if="rules.issue_at == true">
              <p class="text-red-500 text-sm">Issue Date Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- Termin -->
          <FormGroup label="Code Jasa Kirim" :required="true">
            <input
              type="text"
              id="deposit"
              disabled
              name="deposit"
              v-model="code_jakir"
              :class="inputClass(rules.deposit)"
              placeholder="Enter Code Jasa Kirim"
            />
          </FormGroup>

          <!-- Due Date -->
          <FormGroup label="Due Date" :required="true">
            <input
              type="date"
              id="due_at"
              name="due_at"
              v-model="due_at"
              :class="inputClass(rules.due_at)"
            />
            <div class="" v-if="rules.due_at == true">
              <p class="text-red-500 text-sm">Due Date Dibutuhkan</p>
            </div>
          </FormGroup>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <!-- No -->
          <FormGroup label="Vendor" class="relative" :required="true">
            <input
              type="text"
              name="vendor_name"
              id="vendor_name"
              v-model="vendor_name"
              @input="filtervendors"
              autocomplete="off"
              class="rounded w-full"
              disabled
              :class="inputClass(rules.deposit)"
              placeholder="Type Vendor Name"
            />
            <ul
              v-if="filteredvendors.length"
              class="border rounded w-full mt-2 bg-white absolute z-40"
            >
              <li
                v-for="vendor in filteredvendors"
                :key="vendor.vendor_id"
                @click="selectvendor(vendor)"
                class="p-2 cursor-pointer hover:bg-gray-200"
              >
                {{ vendor.vendor_name }}
              </li>
            </ul>
            <div class="" v-if="rules.vendor_id == true">
              <p class="text-red-500 text-sm">Vendor Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- Total Service -->
          <FormGroup label="Deposit" :required="true">
            <input
              type="number"
              id="deposit"
              disabled
              name="deposit"
              v-model="deposit"
              :class="inputClass(rules.deposit)"
              placeholder="Enter Deposit"
            />
          </FormGroup>

          <!-- Deposit -->
          <FormGroup> </FormGroup>
        </div>
        <div class="flex justify-content-between gap-4 items-end" v-if="!id">
          <FormGroup
            class="w-full relative"
            label="product"
            :required="true"
            :error="rules.product_id"
            errorMessage="product_id is required"
          >
            <input
              type="text"
              name="product_name"
              id="product_name"
              v-model="product_name"
              autocomplete="off"
              @input="filterProducts"
              class="rounded w-full"
              :class="inputClass(rules.deposit)"
              placeholder="Type product name"
            />
            <ul v-if="filteredProducts.length" class="border rounded w-full mt-2 bg-white absolute">
              <li
                v-for="product in filteredProducts"
                :key="product.product_id"
                @click="selectProduct(product)"
                class="p-2 cursor-pointer hover:bg-gray-200"
              >
                {{ product.product_sn }} - {{ product.product_desc }}
              </li>
            </ul>
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
              v-model="price"
              :class="inputClass(rules.quantity)"
              placeholder="Enter Quantity"
            />
          </FormGroup>

          <div>
            <button
              type="button"
              class="border-gray-300 border-2 px-3 h-12 rounded-lg"
              @click="addPoDetails"
            >
              tambah
            </button>
          </div>
        </div>
        <div class="mt-5">
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
            <thead>
              <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                <th class="px-3 py-2 font-semibold text-left border-b">Product Name</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Quantity</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Price</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Amount</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-for="poDetail in purchase_order_details" :key="poDetail.product_id">
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_desc }}</td>
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
              <div class="sub_total flex justify-between mt-3">
                <div class="ppn flex items-center space-x-2">                  
                  <p>PPN                   
                  </p>
                </div>
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
import { computed } from 'vue'
import {
  DetailPo,
  Employee,
  PoJasaKirim,
  PoJasaKirimCode,
  PoJasaKirimDetail,
  Product,
  PurchaseOrder,
  PurchaseOrderAdd,
  Vendor,
} from '@/core/utils/url_api'
import router from '@/router'
import { useAuthStore } from '@/stores/authStores'
import { useRoute } from 'vue-router'

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
    const { user } = useAuthStore()
    return {
      id: null,
      user: user,      
      vendors: [],
      vendor_name: '',
      filteredvendors: [],
      employee_name: '',
      filteredEmployees: [],
      product_name: '',
      filteredProducts: [],
      employees: [],
      products: [],
      product_id: [],
      quantity: [],
      vendor_id: null,
      employee_id: null,
      price: 0,
      code_jakir : '',
      po_type: '',
      status_payment: "Hasn't Payed",
      total_tax: 0,
      total_service: 0,
      deposit: 0,
      issue_at: '',
      due_at: '',
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        vendor_id: false,
        issue_at: false,
        termin: false,
        due_at: false,
        purchase_order_details: false,
      },
      purchase_order_details: [],
    }
  },
  async mounted() {
    this.employee_id = this.user.employee_id

    const route = useRoute()
    const id = route.params.id    

    if (id) {
      this.getById(id)
      this.id = id
    }

    this.issue_at = new Date().toLocaleDateString('en-CA')
  },  

  computed: {
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.purchase_order_details.reduce((total, item) => {
        return total + item.quantity * item.price
      }, 0)
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
    // Helper method to format date as YYYY-MM-DD
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
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
      axios.get(PoJasaKirimDetail + '/' + id).then((res) => {
        var data = res.data
        for (let i = 0; i < data.length; i++) {
          var object = {            
            product_desc: data[i].product_name,
            quantity: data[i].quantity,
            price: data[i].price,
            discount: data[i].discount,
            amount: data[i].price * data[i].quantity,
          }
          this.purchase_order_details.push(object)
        }
      })
    },

    async getById(id) {
      await axios.get(PoJasaKirim + '/' + id).then((res) => {
        var data = res.data
        this.issue_at = data[0].issue_at
        this.due_at = data[0].due_at
        this.code_jakir = data[0].code_jasakirim,
        this.vendor_name = data[0].vendor.vendor_name        
        this.deposit = data[0].deposit
        if (data[0].id_jasakirim) {
            this.getDetailSo(data[0].id_jasakirim);
        }
      });
    },    

    inputClass(error) {
      return [
        'w-full dark:bg-gray-800 dark:text-gray-400 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
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
