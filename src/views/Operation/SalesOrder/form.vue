<!-- eslint-disable vue/block-lang -->
<template>
  <AdminLayout>
    <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
      <!-- Notification -->
      <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
        @close="notification.show = false" />

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="flex justify-between items-center p-6 border-b">
          <div v-if="id" class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Sales Order</h1>
            <p class="text-gray-500 text-sm mt-1">Sales Order / Form</p>
          </div>
          <div v-else class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">
              Create New Sales Order
            </h1>
            <p class="text-gray-500 text-sm mt-1">Sales Order / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/sales-order"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
              <i class="fas fa-times"></i>
              Cancel
            </RouterLink>
            <button v-if="id" type="submit"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              {{ isSubmitting ? 'Updating...' : 'Update ' }}
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
      <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- No -->
          <!-- Total Service -->
          <FormGroup label="PO Number" :required="true">
            <input type="text" id="deposit" name="deposit" autocomplete="off" v-model="po_number"
              :class="inputClass(rules.deposit)" placeholder="Enter Po Number" />
            <div class="" v-if="rules.po_number == true">
              <p class="text-red-500 text-sm">Purchase Order Number Dibutuhkan</p>
            </div>
          </FormGroup>
          <!-- customer -->
          <FormGroup label="Customer" class="relative" :required="true">
            <input type="text" autocomplete="off" name="customer_name" id="customer_name" v-model="customer_name"
              @input="filterCustomers" class="rounded w-full" placeholder="Type customer name"
              :class="inputClass(rules.issue_at)" />
            <ul v-if="filteredCustomers.length" class="border rounded w-full mt-2 absolute z-40 bg-white">
              <li v-for="customer in filteredCustomers" :key="customer.customer_id" @click="selectCustomer(customer)"
                class="p-2 cursor-pointer hover:bg-gray-200">
                {{ customer.customer_name }}
              </li>
              <li v-if="filteredCustomers.length === 0">not found</li>
            </ul>
            <div class="" v-if="rules.customer_id == true">
              <p class="text-red-500 text-sm">Customer Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- Total Service -->
          <FormGroup label="Deposit" :required="true">
            <input type="number" id="deposit" name="deposit" v-model="deposit" :class="inputClass(rules.deposit)"
              placeholder="Enter Deposit" />
          </FormGroup>
          <!-- Issue Date -->
          <FormGroup label="Issue Date" :required="true" :error="rules.issue_at" errorMessage="Issue Date is required">
            <input type="date" id="issue_at" name="issue_at" v-model="issue_at" :class="inputClass(rules.issue_at)" />
          </FormGroup>

          <!-- Termin -->
          <FormGroup label="Term of Payment" :required="true" :error="rules.po_type" errorMessage="PO Type is required">
            <select id="po_type" name="po_type" v-model="termin" class="rounded w-full"
              :class="inputClass(rules.issue_at)">
              <option value="">-- termin --</option>
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
          <FormGroup label="Due Date" :required="true" :error="rules.due_at" errorMessage="Due Date is required">
            <input type="date" id="due_at" name="due_at" v-model="due_at" :class="inputClass(rules.due_at)" />
          </FormGroup>
        </div>
        <div class="flex justify-content-between gap-4 items-end mt-5">
          <FormGroup class="w-full relative" label="product" :required="true">
            <input type="text" autocomplete="off" name="product_name" id="product_name" v-model="product_name"
              @input="filterProducts" class="rounded w-full" placeholder="Type product name"
              :class="inputClass(rules.due_at)" />
            <ul v-if="filteredProducts.length" class="border rounded w-full mt-2 bg-white absolute">
              <li v-for="product in filteredProducts" :key="product.product_id" @click="selectProduct(product)"
                class="p-2 cursor-pointer hover:bg-gray-200">
                {{
                  product.type === 'product'
                    ? `${product.product_sn} - ${product.product_desc}`
                    : `${product.package_sn} - ${product.package_desc}`
                }}
              </li>
            </ul>
          </FormGroup>

          <!-- Grand Total -->
          <FormGroup class="w-full" label="Quantity" :required="true" :error="rules.quantity"
            errorMessage="Quantity is required">
            <input type="number" autocomplete="off" name="quantity" v-model="quantity"
              :class="inputClass(rules.quantity)" placeholder="Enter Quantity" />
          </FormGroup>
          <FormGroup class="w-full" label="Price" :required="true" :error="rules.quantity"
            errorMessage="Price is required">
            <input type="number" id="quantity" autocomplete="off" name="quantity" v-model="price"
              :class="inputClass(rules.quantity)" placeholder="Enter Price" :valu="price" />
          </FormGroup>
          <div class="" v-if="id">
            <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg" @click="addPoDetails">
              tambah
            </button>
          </div>
          <div class="" v-else>
            <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg" @click="addPoDetails">
              tambah
            </button>
          </div>
        </div>
        <div class="mt-5">
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
            <thead>
              <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                <th class="px-3 py-2 font-semibold text-left border-b">Code</th>
                <th class="px-3 py-2 font-semibold text-left border-b">PN</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Product Name</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Product Type</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Quantity</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Price</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Discount</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Amount</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:text-gray-400">
              <tr v-for="(poDetail, index) in sales_order_details" :key="index" :class="{
                'bg-red-200': poDetail.product_type === 'product' && poDetail.quantity > poDetail.product_stock,
                'bg-blue-50': poDetail.product_type === 'package'
              }">
                <td class="px-3 py-2 whitespace-no-wrap">
                  {{ poDetail.product_code }}
                  <span v-if="poDetail.is_package" class="text-xs text-blue-600">(Package)</span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_pn }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  {{ poDetail.product_desc }}
                  <div v-if="poDetail.is_package" class="text-xs text-gray-500">
                    Contains multiple items
                  </div>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <span class="px-2 py-1 text-xs rounded-full" :class="{
                    'bg-green-100 text-green-800': poDetail.product_type === 'product',
                    'bg-blue-100 text-blue-800': poDetail.product_type === 'package'
                  }">
                    {{ poDetail.product_type }}
                  </span>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.quantity }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.price) }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <input type="number" v-model="poDetail.discount" class="w-20 rounded-lg"
                    @change="updateAmount(poDetail)" min="0" max="100" /> %
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.amount) }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <button type="button"
                    class="border-gray-300 border-2 px-3 h-12 rounded-lg dark:text-gray-400 hover:bg-red-100"
                    @click="sales_order_details.splice(index, 1)">
                    Delete
                  </button>
                </td>
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
import { defineComponent } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import Swal from 'sweetalert2'
import Notification from '@/components/Notification.vue'
import FormGroup from '@/components/FormGroup.vue'
import axios from 'axios'
import {
  Customer,
  DetailSo,
  PackageADRS,
  Product,
  SalesOrderAdd,
  SalesOrders,
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
      customers: [],
      customer_name: '',
      filteredCustomers: [],
      selectedType: '',
      product_name: '',
      filteredProducts: [],
      employees: [],
      products: [],
      packages: [],
      packages_id: [],
      product_id: [],
      quantity: [],
      customer_id: null,
      employee_id: null,
      price: 0,
      termin: '',
      po_type: '',
      status_payment: "Hasn't Payed",
      total_tax: 0,
      total_service: 0,
      discount: 0,
      deposit: 0,
      po_number: '',
      searchTerm: '',
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
        po_number: false,
        issue_at: false,
        termin: false,
        due_at: false,
        sales_order_details: false,
      },
      sales_order_details: [],
    }
  },
  async mounted() {
    this.employee_id = this.user.employee_id
    this.getCustomer();
    this.getProducts();
    this.getPackage();

    const route = useRoute()
    const id = route.params.id
    if (id) {
      this.getById(id)
      this.id = id
    }
    this.issue_at = new Date().toLocaleDateString('en-CA')
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
      return this.sales_order_details.reduce((total, item) => {
        return total + item.amount || 0
      }, 0)
    },

    ppn() {
      return this.sub_total * 0.11
    },

    grand_total() {
      return this.ppn + this.sub_total
    },
  },

  methods: {
    updateAmount(poDetail) {
      const discountPercentage = parseFloat(poDetail.discount) || 0
      const discountedPrice = poDetail.price * (1 - discountPercentage / 100)
      poDetail.amount = discountedPrice * poDetail.quantity
    },

    getCustomer() {
      axios.get(Customer).then((res) => {
        var data = res.data
        this.customers = data
      })
    },
    getProducts() {
      axios.get(Product).then((res) => {
        var data = res.data
        this.products = data
      })
    },
    getPackage() {
      axios.get(PackageADRS).then((res) => {
        var data = res.data
        this.packages = data
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },

    addPoDetails() {
      if (this.product_id == null && this.packages_id == null) {
        Swal.fire({
          icon: 'warning',
          text: 'Pilih Barang',
        })
      } else {
        if (this.selectedType === 'product') {
          axios.get(Product + '/' + this.product_id).then((res) => {
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
                product_stock: data.product_stock,
                product_type: this.selectedType,
                quantity: this.quantity,
                price: this.price,
                discount: this.discount,
                amount: this.price * this.quantity,
              }
              this.sales_order_details.push(object)
            } else {
              var object = {
                product_id: data.product_id,
                product_code: data.product_code,
                product_pn: data.product_sn,
                product_desc: data.product_desc,
                product_stock: data.product_stock,
                product_type: this.selectedType,
                quantity: this.quantity,
                price: this.price,
                discount: this.discount,
                amount: this.price * this.quantity,
              }
              this.sales_order_details.push(object)
            }
            this.product_id = null
            this.quantity = 0
            this.price = 0
          })
        } else {
          axios.get(PackageADRS + '/' + this.packages_id).then((res) => {
            var data = res.data[0]
            if (this.quantity > data.package_stock) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: `Stock ${data.package_desc} Less Than Quantity`,
              })
              var object = {
                package_id: data.package_id,
                product_code: data.code_package,
                product_pn: data.package_sn,
                product_desc: data.package_desc,
                product_stock: data.package_stock,
                product_type: this.selectedType,
                quantity: this.quantity,
                price: this.price,
                discount: this.discount,
                amount: this.price * this.quantity,
              }
              this.sales_order_details.push(object)
            } else {
              var object = {
                package_id: data.package_id,
                product_code: data.code_package,
                product_pn: data.package_sn,
                product_desc: data.package_desc,
                product_stock: data.package_stock,
                product_type: this.selectedType,
                quantity: this.quantity,
                price: this.price,
                discount: this.discount,
                amount: this.price * this.quantity,
              }
              this.sales_order_details.push(object)
            }
            this.product_id = null
            this.quantity = 0
            this.price = 0
          })
        }
      }
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
      } else if (issueDate && termin === 'N45') {
        const date = new Date(issueDate) // Convert issue_at to a Date object
        date.setDate(date.getDate() + 45) // Add 30 days
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

    filterCustomers() {
      const searchTerm = this.customer_name.toLowerCase()
      this.filteredCustomers = this.customers.filter((customer) => {
        const name = customer.customer_name.toLowerCase()
        return name.includes(searchTerm)
      })
    },
    selectCustomer(customer) {
      this.customer_id = customer.customer_id
      this.customer_name = customer.customer_name
      this.filteredCustomers = []
    },

    filterProducts() {
      const searchTerm = this.product_name.toLowerCase()

      const filteredProduct = this.products.filter((product) => {
        const desc = product.product_desc.toLowerCase()
        const sn = product.product_sn.toLowerCase()
        return desc.includes(searchTerm) || sn.includes(searchTerm)
      });

      const filteredPack = this.packages.filter((pack) => {
        const desc = pack.package_desc.toLowerCase();
        const sn = pack.package_sn.toLowerCase();

        return desc.includes(searchTerm) || sn.includes(searchTerm);
      })

      this.filteredProducts = [
        ...filteredProduct.map(p => ({ ...p, type: 'product' })), // Add a type property to distinguish
        ...filteredPack.map(p => ({ ...p, type: 'package' })) // Add a type property to distinguish
      ]
    },

    selectProduct(product) {
      if (product.type === 'product') {
        this.product_id = product.product_id
        this.product_name = `${product.product_sn} - ${product.product_desc}`
      } else {
        this.packages_id = product.package_id,
          this.product_name = `${product.package_sn} - ${product.package_desc}`
      }
      this.selectedType = product.type;
      this.filteredProducts = []
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

      if (this.po_number == '' || this.po_number == null) {
        this.rules.po_number = true
        count++
      } else {
        this.rules.po_number = false
      }

      if (this.issue_at == '' || this.issue_at == null) {
        this.rules.issue_at = true
        count++
      } else {
        this.rules.issue_at = false
      }

      if (this.termin == '' || this.termin == null) {
        this.rules.termin = true
        count++
      } else {
        this.rules.termin = false
      }

      if (this.due_at == '' || this.due_at == null) {
        this.rules.due_at = true
        count++
      } else {
        this.rules.due_at = false
      }

      if (this.sales_order_details.length == 0) {
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
      }
      return count
    },

    getDetailSo(id) {
      axios.get(DetailSo + '/' + id).then((res) => {
        const data = res.data;
        this.sales_order_details = []; // Clear existing data

        // Process each item sequentially using Promise.all
        const promises = data.map(item => {
          return new Promise((resolve) => {
            if (item.product_type === 'product') {
              // For product type
              const productObj = {
                product_id: item.product_id,
                product_code: item.product?.product_code || '',
                product_desc: item.product?.product_desc || '',
                product_pn: item.product?.product_sn || '',
                product_brand: item.product?.product_brand || '',
                product_type: item.product_type,
                quantity: item.quantity,
                quantity_left: item.quantity_left,
                price: item.price,
                discount: item.discount,
                amount: item.amount,
                has_do: item.has_do
              };
              resolve(productObj);
            } else {              
              const packageObj = {
                  product_id: item.package[0].package_id,
                  product_code: item.package[0].code_package || '',
                  product_desc: item.package[0].package_desc || '',
                  product_pn: item.package[0].package_sn || '',
                  product_type: item.product_type,
                  quantity: item.quantity,
                  quantity_left: item.quantity_left,
                  price: item.price,
                  discount: item.discount,
                  amount: item.amount,
                  has_do: item.has_do
                };
                resolve(packageObj);              
            }
          });
        });

        // Wait for all promises to complete
        Promise.all(promises).then(results => {
          this.sales_order_details = results.filter(item => item !== null);
        });
      });
    },

    async getById(id) {
      await axios.get(SalesOrders + '/' + id).then((res) => {
        var data = res.data
        this.issue_at = data.issue_at
        this.due_at = data.due_at
        this.po_number = data.po_number
        this.termin = data.termin
        this.deposit = data.deposit
        this.id_so = data.id_so
        this.customer_id = data.customer_id
        this.code_invoice = data.code_invoice
        this.customer_name = data.customer.customer_name
        this.customer_address = data.customer.customer_address

        var id = data.id_so
        if (id) {
          this.getDetailSo(id)
        }
      })
    },

    async onSubmit(e = null) {
      e?.preventDefault?.()
      const result = await this.validation()
      console.log(result)
      if (result == 0) {
        if (this.id) {
          const formattedDetails = this.sales_order_details.map((item) => {
            return {
              id_detail_so: item.id_detail_so, // Tambahkan jika ada untuk update
              product_id: item.product_id,
              package_id: item.package_id,
              product_type: item.product_type,
              quantity: item.quantity,
              quantity_left: item.quantity_left || 0,
              has_do: item.has_do || 0,
              price: item.price,
              discount: item.discount || 0,
              amount: item.amount,
            }
          })
          await axios
            .put(SalesOrderAdd + '/' + this.id, {
              customer_id: this.customer_id,
              employee_id: this.employee_id,
              termin: this.termin,
              po_number: this.po_number,
              total_tax: this.total_tax,
              deposit: this.deposit,
              issue_at: this.issue_at,
              due_at: this.due_at,
              has_invoice: 0,
              sales_order_details: formattedDetails,
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
                    await router.push('/sales-order')
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
          console.log(this.sales_order_details)
          await axios
            .post(SalesOrderAdd, {
              customer_id: this.customer_id,
              employee_id: this.employee_id,
              termin: this.termin,
              po_number: this.po_number,
              total_tax: this.total_tax,
              deposit: this.deposit,
              issue_at: this.issue_at,
              due_at: this.due_at,
              has_invoice: 0,
              sales_order_details: this.sales_order_details,
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
                    await router.push('/sales-order')
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
