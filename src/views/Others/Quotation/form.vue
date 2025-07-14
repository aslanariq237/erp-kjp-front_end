<template>
  <AdminLayout>
    <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
      <!-- Notification -->
      <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
        @close="notification.show = false" />

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800">
        <div class="flex justify-between items-center p-6 border-b">
          <div class="breadcrumb">
            <h1 v-if="id" class="text-2xl font-bold text-gray-800 dark:text-white/90">
              Edit New Quotation
            </h1>
            <h1 v-else class="text-2xl font-bold text-gray-800 dark:text-white/90">
              Create New Quotation
            </h1>
            <p class="text-gray-500 text-sm mt-1">Others / Quotation / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/quotation"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
              <i class="fas fa-times"></i>
              Cancel
            </RouterLink>
            <button v-if="id" type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              {{ isSubmitting ? 'Updating...' : 'Update' }}
            </button>
            <button v-else type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
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
          <FormGroup label="Issue Date" :required="true" :error="rules.issue_at" errorMessage="Issue Date is required">
            <!-- <p> {{ issue_at }}</p> -->
            <input type="date" id="issue_at" name="issue_at" v-model="issue_at" :class="inputClass(rules.issue_at)" />
            <div class="" v-if="rules.issue_at == true">
              <p class="text-red-500 text-sm">Issue Date Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- Termin -->
          <FormGroup label="Term of Payment" :required="true" :error="rules.po_type" errorMessage="PO Type is required">
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
            <div class="" v-if="rules.termin == true">
              <p class="text-sm text-red-500">Termin Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- Due Date -->
          <FormGroup label="Due Date" :required="true" :error="rules.due_at">
            <input type="date" id="due_at" name="due_at" v-model="due_at" :class="inputClass(rules.due_at)" />
            <div class="" v-if="rules.due_at == true">
              <p class="text-sm text-red-500">Due Date Dibutuhkan</p>
            </div>
          </FormGroup>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <!-- No -->
          <FormGroup label="Customer" class="relative" :required="true" :error="rules.customer_id"
            errorMessage="Customer is Required">
            <input type="text" name="customer_name" id="customer_name" v-model="customer_name" autocomplete="off"
              @input="filterCustomers" :class="inputClass(rules.due_at)" placeholder="Type customer name" />
            <ul v-if="filteredCustomers.length" class="border rounded w-full mt-2 bg-white absolute z-40">
              <li v-for="customer in filteredCustomers" :key="customer.customer_id" @click="selectCustomer(customer)"
                class="p-2 cursor-pointer hover:bg-gray-200">
                {{ customer.customer_code }} - {{ customer.customer_name }}
              </li>
            </ul>
            <div class="" v-if="rules.customer_name == true">
              <p class="text-red-500 text-sm">Customer Dibutuhkan</p>
            </div>
          </FormGroup>
          <!-- Code PO -->
        </div>
        <FormGroup 
          label="Note" 
          class="relative w-full mt-4 border-gray-500" 
          :required="true" 
          :error="rules.customer_id"
        >
          <textarea 
            name="note" 
            id="note" 
            cols="30" 
            class="rounded-md w-full border-gray-500" 
            v-model="description"
          >
          </textarea>
        </FormGroup>
        <div class="flex justify-content-between gap-4 items-end mt-4">
          <FormGroup
              class="w-full md:w-2/5 relative"
              label="Product"
              :required="true"
              :error="rules.product_id"
              errorMessage="Pilih produk"
            >
              <input 
                type="text" 
                name="customer_name" 
                id="customer_name" 
                v-model="product_name" 
                autocomplete="off"
                @input="filterProducts" 
                class="rounded-md"                
                placeholder="Type customer name" 
              />
              <ul
                v-if="filteredProducts.length && product_name"
                class="absolute z-40 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600"
              >
                <li
                  v-for="product in filteredProducts"
                  :key="product.product_id"
                  @click="selectProduct(product)"
                  class="p-3 cursor-pointer dark:hover:bg-gray-600 transition-colors duration-150 text-gray-800 dark:text-gray-200"
                >
                  {{ product.product_sn }} - {{ product.product_desc }}
                </li>
                <li
                  v-if="filteredProducts.length === 0 && product_name"
                  class="p-3 text-gray-500 italic"
                >
                  Tidak ada produk yang cocok.
                </li>
              </ul>
            </FormGroup>

          <!-- Grand Total -->
          <FormGroup class="w-full" label="Quantity" :required="true" :error="rules.quantity"
            errorMessage="Quantity is required">
            <input type="number" id="quantity" name="quantity" v-model="quantity" :class="inputClass(rules.quantity)"
              placeholder="Enter Quantity" />
          </FormGroup>
          <FormGroup class="w-full" label="Price" :required="true" :error="rules.quantity"
            errorMessage="Price is required">
            <input type="number" id="quantity" name="quantity" v-model="price" :class="inputClass(rules.quantity)"
              placeholder="Enter Quantity" />
          </FormGroup>
          <div v-if="id">
            <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg dark:text-gray-400"
              @click="addPoDetails">
              tambah
            </button>
          </div>
          <div v-else>
            <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg dark:text-gray-400"
              @click="addPoDetails">
              tambah
            </button>
          </div>
        </div>
        <div class="mt-5 relative overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border dark:bg-gray-800 dark:text-gray-400/90">
            <thead>
              <tr class="text-center">
                <th class="px-3 py-2 font-semibold text-left border-b">Code</th>
                <th class="px-3 py-2 font-semibold text-left border-b">PN</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Product Name</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Quantity</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Product Price</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Discount</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Product Amount</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800">
              <tr v-for="poDetail in inquiry_details" :key="poDetail.product_id">
                <td class="px-3 py-2 whitespace-nowrap">{{ poDetail.product_code }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ poDetail.product_pn }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ poDetail.product_desc }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ poDetail.quantity }}</td>
                <td class="px-3 py-2 whitespace-nowrap">{{ formatCurrency(poDetail.price) }}</td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <input type="text" v-model="poDetail.discount"
                    class="w-20 rounded-lg dark:bg-gray-800 dark:text-gray-400" @change="updateAmount(poDetail)" />
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.amount) }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg dark:text-gray-400"
                    @click="inquiry_details.splice(inquiry_details.indexOf(poDetail), 1)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
            <div class="" v-if="rules.inquiry_details == true">
              <p class="text-sm text-red-500">Barang Dibutuhkan</p>
            </div>
          </table>          
        </div>
        <div class="flex justify-between mt-5">
            <div class="">
            </div>
            <div class="w-full"></div>
            <div class="w-full">
              <div class="sub_total flex justify-between mt-3 text-gray-500">
                <p>Sub Total</p>
                <p>{{ formatCurrency(sub_total) }}</p>
              </div>
              <div class="sub_total flex justify-between mt-3 text-gray-500">
                <div class="flex items-center">
                  <input type="checkbox" v-model="checkppn" class="mr-2">
                  <p>PPN</p>
                </div>
                <p>{{ formatCurrency(ppn) }}</p>
              </div>
              <div class="sub_total flex justify-between mt-3 text-gray-500">
                <p>Grand Total</p>
                <p>{{ formatCurrency(grand_total) }}</p>
              </div>
              <input type="text" v-model="code_quatation" hidden />
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
  Customer,
  DetailQuatation,
  Employee,
  Product,
  Quatations,
  QuatationsAdd,
} from '@/core/utils/url_api'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStores'
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
    const { user } = useAuthStore()
    return {
      id: null,
      user: user,
      customers: [],
      checkppn: true,
      customer_name: '',
      filteredCustomers: [],
      product_name: '',
      filteredProducts: [],
      products: [],
      description: '',
      product_id: [],
      quantity: [],
      customer_id: null,
      employee_id: null,
      price: 0,
      code_quatation: null,
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
        customer_name: false,
        inquiry_details: false,
        issue_at: false,
        due_at: false,
      },
      inquiry_details: [],
    }
  },
  async mounted() {
    const route = useRoute()
    const id = route.params.id
    this.employee_id = this.user.employee_id

    this.getCustomer()
    this.getProducts()
    if (id) {
      this.getById(id)
      this.id = id
    } else {
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
        return total + item.price * item.quantity || 0
      }, 0)
    },
    ppn() {
      return this.checkppn ? this.sub_total * 0.11 : 0;
    },
    grand_total() {
      return this.sub_total + this.ppn;
    }
  },

  methods: {
    getCustomer() {
      ApiServices.get(Customer).then((res) => {
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
      ApiServices.get(Product).then((res) => {
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

    addPoDetails() {
      if (this.product_id == '' || this.product_id == null) {
        Swal.fire({
          icon: 'warning',
          text: 'Pilih Barang',
        })
      } else {
        ApiServices.get(Product + '/' + this.product_id).then((res) => {
          var data = res.data[0]
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
      }      
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
      } else if (issueDate && termin === 'N45') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 45) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'N14') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 14) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'N60') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 60) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'CBD') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 30) // Add 30 days
        this.due_at = this.formatDate(date)
      } else if (issueDate && termin === 'CAD') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 30) // Add 30 days
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
        this.rules.customer_name = true
        count++
      } else {
        this.rules.customer_name = false
      }

      if (this.issue_at == '' || this.issue_at == null) {
        this.rules.issue_at = true
        count++
      } else {
        this.rules.issue_at = false
      }

      if (this.due_at == '' || this.due_at == null) {
        this.rules.due_at = true
        count++
      } else {
        this.rules.due_at == false
      }

      if (this.inquiry_details.length == 0) {
        Swal.fire({
          text: 'Tambahkan 1 atau lebih barang!',
          icon: 'error',
          buttonsStyling: true,
          confirmButtonText: 'Try Again!',
          heightAuto: false,
          customClass: {
            confirmButton: 'btn fw-semibold btn-light-danger',
          },
        })
        count++
      }

      return count
    },
    getDetailQuotation(id) {
      ApiServices.get(DetailQuatation + '/' + id).then((res) => {
        var data = res.data
        for (let i = 0; i < data.length; i++) {
          var object = {
            id_detail_quatation: data[i].id_detail_quatation,
            product_id: data[i].product_id,
            product_code: data[i].product.product_code,
            product_pn: data[i].product.product_sn,
            discount: data[i].discount,
            product_desc: data[i].product.product_desc,
            quantity: data[i].quantity,
            price: data[i].price,
            amount: data[i].amount,
          }
          this.inquiry_details.push(object)
        }
      })
    },
    async getById(id) {
      await ApiServices.get(Quatations + '/' + id).then((res) => {
        var data = res.data
        this.issue_at = data[0].issue_at
        this.due_at = data[0].due_at
        this.customer_name = data[0].customer.customer_name
        this.customer_id = data[0].customer_id
        this.termin = data[0].termin
        this.description = data[0].description,
          this.code_quatation = data[0].code_quatation
        var id = data[0].id_quatation
        if (id) {
          this.getDetailQuotation(id)
        }
      })
    },
    async onSubmit(e = null) {
      e?.preventDefault?.()

      const result = await this.validation()

      if (result == 0) {
        if (this.id == null) {
          await ApiServices
            .post(QuatationsAdd, {
              customer_id: this.customer_id,
              employee_id: 1,
              termin: this.termin,
              total_tax: this.total_tax,
              issue_at: this.issue_at,
              checkppn: this.checkppn,
              due_at: this.due_at,
              sub_total: this.sub_total,
              ppn: this.ppn,
              grand_total: this.grand_total,
              inquiry_details: this.inquiry_details,
            })
            .then(
              async (response) => {                
                await Swal.fire({
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
                    (error.response && error.response.message) || error.message || error.toString(),
                })
              },
            )
        } else {
          await ApiServices
            .put(QuatationsAdd + '/' + this.id, {
              customer_id: this.customer_id,
              employee_id: this.employee_id,
              termin: this.termin,
              checkppn: this.checkppn,
              code_quatation: this.code_quatation,
              total_tax: this.total_tax,
              issue_at: this.issue_at,
              description: this.description,
              due_at: this.due_at,
              sub_total: this.sub_total,
              inquiry_details: this.inquiry_details,
            })
            .then(
              async (response) => {                                
                await Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: 'Data has been Updated',
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
                    (error.response && error.response.message) || error.message || error.toString(),
                })
              },
            )
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill in all required fields',
        })
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
