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
      <div class="bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800">
        <div class="flex justify-between items-center p-6 border-b">
          <div class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Create New Quotation</h1>
            <p class="text-gray-500 text-sm mt-1">Others / Quotation / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/quotation"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
            >
              <i class="fas fa-times"></i>
              Cancel
            </RouterLink>
            <button
              type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Issue Date -->
          <FormGroup          
            label="Issue Date"
            :required="true"
            :error="rules.issue_at"
            errorMessage="Issue Date is required"
          >
            <!-- <p> {{ issue_at }}</p> -->
            <input
              type="date"
              id="issue_at"
              name="issue_at"
              v-model="issue_at"
              :class="inputClass(rules.issue_at)"
            />
          </FormGroup>

          <!-- Termin -->
          <FormGroup
            label="Term of Payment"
            :required="true"
            :error="rules.po_type"
            errorMessage="PO Type is required"
          >
            <select id="po_type" name="po_type" v-model="termin" :class="inputClass(rules.due_at)">
              <option value="CBD">CBD(Cash Before Delivery)</option>
              <option value="CAD">CAD(Cash After Delivery)</option>
              <option value="N14">N14</option>
              <option value="N30">N30</option>
              <option value="N45">N45</option>
              <option value="N60">N60</option>
              <option value="N75">N75</option>
              <option value="N90">N90</option>
            </select>
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
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <!-- No -->
          <FormGroup
            label="Customer"
            class="relative"
            :required="true"
            :error="rules.customer_id"
            errorMessage="Customer is Required"
          >
            <input
              type="text"
              name="customer_name"
              id="customer_name"
              v-model="customer_name"
              @input="filterCustomers"
              :class="inputClass(rules.due_at)"
              placeholder="Type customer name"
            />
            <ul
              v-if="filteredCustomers.length"
              class="border rounded w-full mt-2 bg-white absolute z-40"
            >
              <li
                v-for="customer in filteredCustomers"
                :key="customer.customer_id"
                @click="selectCustomer(customer)"
                class="p-2 cursor-pointer hover:bg-gray-200"
              >
                {{ customer.customer_code }} - {{ customer.customer_name }}
              </li>
            </ul>
          </FormGroup>          
          <!-- Code PO -->
        </div>
        <div class="flex justify-content-between gap-4 items-end mt-8 ">
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
              @input="filterProducts"
              class="rounded w-full dark:bg-gray-800"
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
          <button
            type="button"
            class="border-gray-300 border-2 px-3 h-12 rounded-lg dark:text-gray-400"
            @click="addPoDetails"
          >
            tambah
          </button>
        </div>
        <div class="mt-5">
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border dark:bg-gray-800 dark:text-gray-400/90">
            <thead>
              <tr class="text-center">
                <th class="px-3 py-2 font-semibold text-left border-b">Code</th>
                <th class="px-3 py-2 font-semibold text-left border-b">PN</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Product Name</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Quantity</th>
                <th class="px-3 py-2 font-semibold text-left border-b">
                  Product Price
                </th>
                <th class="px-3 py-2 font-semibold text-left border-b">Discount</th>
                <th class="px-3 py-2 font-semibold text-left border-b">
                  Product Amount
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800">
              <tr v-for="poDetail in inquiry_details" :key="poDetail.product_id">
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_code }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_pn }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_desc }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.quantity }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.price) }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <input
                    type="text"
                    v-model="poDetail.discount"
                    class="w-20 rounded-lg dark:bg-gray-800 dark:text-gray-400"                    
                    @change="updateAmount(poDetail)"
                  />
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.amount) }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between mt-5">
            <div class="w-full"></div>
            <div class="w-full"></div>
            <div class="w-full">
              <div class="sub_total flex justify-between mt-3 text-gray-500">
                <p>Sub Total</p>
                <p>{{ formatCurrency(sub_total) }}</p>                
              </div>
              <input type="text" v-model="code_quatation" hidden>
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
import { Customer, DetailQuatation, Employee, Product, Quatations, QuatationsAdd } from '@/core/utils/url_api'
import router from '@/router'
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
    return {
      id : null,
      customers: [],
      customer_name: '',
      filteredCustomers: [],
      employee_name: '',
      filteredEmployees: [],
      product_name: '',
      filteredProducts: [],
      employees: [],
      products: [],
      product_id: [],
      quantity: [],
      customer_id: null,
      employee_id: null,
      price: 0,
      code_quatation : null,
      termin: '',
      total_tax: 0,
      discount: 0,
      issue_at: '',
      due_at: '',
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

    this.getCustomer()      
    this.getProducts()
    if (id) {
      this.getById(id); 
      this.id = id;           
    }else{      
      this.issue_at = new Date().toLocaleDateString('en-CA')
    }
  },

  watch: {
    issue_at(newIssueDate) {
      this.calculateDueDate(newIssueDate, this.termin)
    },
    termin(newTermin) {
      this.calculateDueDate(this.issue_at, newTermin)
    },
  },

  computed: {
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.inquiry_details.reduce((total, item) => {
        return total + item.amount || 0
      }, 0)
    },
  },

  methods: {
    getCustomer() {
      axios.get(Customer).then((res) => {
        var data = res.data
        this.customers = data
      })
    },

    updateAmount(poDetail) {
      const discountPercentage = parseFloat(poDetail.discount) || 0
      const discountedPrice = poDetail.price * (1 - discountPercentage / 100)
      poDetail.amount = discountedPrice * poDetail.quantity
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
    selectProduct(product) {
      this.product_id = product.product_id
      this.product_name = `${product.product_sn} - ${product.product_desc}`
      this.filteredProducts = []
    },
    filterCustomers() {
      const searchTerm = this.customer_name.toLowerCase()
      this.filteredCustomers = this.customers.filter((customer) => {
        const name = customer.customer_name.toLowerCase()
        const code = customer.customer_code.toLowerCase()
        return name.includes(searchTerm) || code.includes(searchTerm)
      })
    },
    selectCustomer(customer) {
      this.customer_id = customer.customer_id
      this.customer_name = `${customer.customer_code} - ${customer.customer_name}`
      this.filteredCustomers = []
    },
    filterEmployees() {
      const searchTerm = this.employee_name.toLowerCase()
      this.filteredEmployees = this.employees.filter((employee) => {
        const name = employee.employee_name.toLowerCase()
        return name.includes(searchTerm)
      })
    },
    selectEmployee(employee) {
      this.employee_id = employee.employee_id
      this.employee_name = employee.employee_name
      this.filteredEmployees = []
    },

    addPoDetails() {
      axios.get(Product + '/' + this.product_id).then((res) => {
        var data = res.data
        var object = {
          product_id: data.product_id,
          product_code: data.product_code,
          product_pn: data.product_sn,
          product_desc: data.product_desc,
          quantity: this.quantity,
          price: this.price,
          discount: this.discount,
          amount: this.price * this.quantity,
        }
        this.inquiry_details.push(object)
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },

    calculateDueDate(issueDate, termin) {
      if (issueDate && termin === 'N30') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 30) // Add 30 days
        this.due_at = this.formatDate(date) // Set due_at to the new date
      } else if (issueDate && termin === 'N90') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 90) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'N75') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 75) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'N35') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 35) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'N14') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 14) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'N60') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 60) // Add 30 days
        this.due_at = this.formatDate(date)
      } else {
        this.due_at = '' // Reset due_at if termin is not type3
      }
    },

    // Helper method to format date as YYYY-MM-DD
    formatDate(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
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

      if (this.customer_id == '' || this.customer_id == null) {
        this.rules.customer_id = true
        count++
      } else {
        this.rules.customer_id = false
      }

      return count
    },
    getDetailQuotation(id){
      axios.get(DetailQuatation + '/' + id).then(
        (res) => {
          var data = res.data;                    
          for (let i = 0; i < data.length; i++) {
            var object = {
              id_detail_quatation : data[i].id_detail_quatation,
              product_id: data[i].product_id,
              product_code: data[i].product.product_code,              
              product_pn: data[i].product.product_sn,
              discount : 0,
              product_desc: data[i].product.product_desc,
              quantity: data[i].quantity,
              price: data[i].price,              
              amount: data[i].amount,  
            }       
            this.inquiry_details.push(object);         
          }
        }
      )
    },
    async getById(id){
      await axios.get(Quatations + '/' + id).then(
        (res) => {
          var data = res.data;          
          this.issue_at = data[0].issue_at;         
          this.due_at = data[0].due_at;
          this.customer_name = data[0].customer.customer_name;
          this.customer_id = data[0].customer_id;
          this.termin = data[0].termin;
          this.code_quatation = data[0].code_quatation;
          var id = data[0].id_quatation;          
          if (id) {
            this.getDetailQuotation(id);
          }
        }
      )
    },

    async onSubmit() {
      const result = 2      
      if (result != 0) {                
        if (this.id == null) { 
          await axios
          .post(QuatationsAdd, {
            customer_id: this.customer_id,
            employee_id: 1,
            termin: this.termin,
            total_tax: this.total_tax,
            issue_at: this.issue_at,            
            due_at: this.due_at,
            sub_total: this.sub_total,
            inquiry_details: this.inquiry_details,
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
                  await router.push('/quotation')
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
        }else{          
          await axios
          .put(QuatationsAdd + "/" + this.id, {
            customer_id: this.customer_id,
            employee_id: 1,
            termin: this.termin,
            code_quatation: this.code_quatation,
            total_tax: this.total_tax,
            issue_at: this.issue_at,
            due_at: this.due_at,
            sub_total: this.sub_total,
            inquiry_details: this.inquiry_details,
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
                  await router.push('/quotation')                  
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
