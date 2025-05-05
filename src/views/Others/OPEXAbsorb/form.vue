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
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="flex justify-between items-center p-6 border-b">
          <div v-if="id" class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Edit Opex Absorb</h1>
            <p class="text-gray-500 text-sm mt-1">Finance / Opex / Form</p>
          </div>
          <div v-else class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Create New Opex Absorb</h1>
            <p class="text-gray-500 text-sm mt-1">Finance / Opex / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/opex-absorb"
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
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Opex Name -->
          <FormGroup
            label="Opex Name"
            :required="true"
            :error="rules.opex_name"
            errorMessage="Opex Name is required"
          >
            <input
              type="text"
              id="name"
              name="name"
              v-model="opex_name"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.opex_name
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter Opex Name"
            />
            <div v-if="rules.opex_name">
              <p class="text-red-500 text-sm">Opex Name is required</p>
            </div>
          </FormGroup>

          <!-- Price -->
          <FormGroup
            label="Price"
            :required="true"
            :error="rules.opex_price"
            errorMessage="Price is required and must be greater than 0"
          >
            <input
              type="number"
              id="amount"
              name="amount"
              v-model="opex_price"
              min="0"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.opex_price
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
              placeholder="Enter Price"
            />
            <div v-if="rules.opex_price">
              <p class="text-red-500 text-sm">Price is required</p>
            </div>
          </FormGroup>

          <!-- Opex Type -->
          <FormGroup
            label="Opex Type"
            :required="true"
            :error="rules.opex_type"
            errorMessage="Opex Type is required"
          >
            <select
              name="opex_type"
              id="opex_type"
              v-model="opex_type"
              :class="[
                'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
                rules.opex_type
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-gray-300 focus:ring-blue-500',
              ]"
            >
              <option value="absorb">Absorb</option>
            </select>
          </FormGroup>

          <!-- Customer -->
          <FormGroup
            v-if="opex_type !== 'internal'"
            label="Customer"
            class="relative"
            :required="true"
            :error="rules.customer_id"
            errorMessage="Customer is required"
          >
            <input
              type="text"
              autocomplete="off"
              name="customer_name"
              id="customer_name"
              v-model="customer_name"
              @input="filterCustomers"
              class="rounded w-full"
              placeholder="Type customer name"
            />
            <ul
              v-if="filteredCustomers.length"
              class="border rounded w-full mt-2 absolute z-40 bg-white"
            >
              <li
                v-for="customer in filteredCustomers"
                :key="customer.customer_id"
                @click="selectCustomer(customer)"
                class="p-2 cursor-pointer hover:bg-gray-200"
              >
                {{ customer.customer_name }}
              </li>
              <li v-if="filteredCustomers.length === 0">Not found</li>
            </ul>
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
                <th class="px-3 py-2 font-semibold text-left border-b">Quantity</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Price</th>                
                <th class="px-3 py-2 font-semibold text-left border-b">Amount</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:text-gray-400">
              <tr v-for="poDetail in sales_order_details" :key="poDetail.product_id"
                :class="{ 'bg-red-200': poDetail.quantity > poDetail.product_stock }">
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_code }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_pn }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_desc }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.quantity }}</td>                
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.price) }}</td>                
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(poDetail.amount) }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg dark:text-gray-400"
                    @click="sales_order_details.splice(sales_order_details.indexOf(poDetail), 1)">
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
import { Form } from 'vee-validate'
import { RouterLink } from 'vue-router'
import Notification from '@/components/Notification.vue'
import FormGroup from '@/components/FormGroup.vue'
import axios from 'axios'
import { AddOpex, Customer, GetOpex, PackageADRS, Product } from '@/core/utils/url_api'
import router from '@/router'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'OpexAbsorbForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
  },

  data() {
    return {
      opex_name: '',
      opex_price: 0,
      opex_type: 'absorb',
      customers: [],
      customer_name: '',
      filteredCustomers: [],
      sales_order_details: [],
      selectedType: '',
      product_name: '',
      products: [],
      filteredProducts: [],
      packages: [],
      packages_id: [],
      product_id: [],
      customer_id: null,
      isSubmitting: false,
      id: null,
      rules: {
        opex_name: false,
        opex_price: false,
        opex_type: false,
        customer_id: false,
      },
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
    }
  },
  async mounted() {
    this.getCustomer();
    this.getProducts();
    this.getPackage();    
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      await this.getById(this.id)
    }
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
    getCustomer() {
      axios.get(Customer).then((res) => {
        this.customers = res.data
      })
    },
    filterCustomers() {
      const searchTerm = this.customer_name.toLowerCase()
      this.filteredCustomers = this.customers.filter((customer) =>
        customer.customer_name.toLowerCase().includes(searchTerm),
      )
    },
    selectCustomer(customer) {
      this.customer_id = customer.customer_id
      this.customer_name = customer.customer_name
      this.filteredCustomers = []
    },
    getProducts() {
      axios.get(Product).then((res) => {
        var data = res.data        
        this.products = data;
      })
    },
    getPackage() {
      axios.get(PackageADRS).then((res) => {
        var data = res.data
        this.packages = data;
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },

    addPoDetails() {
      if (this.product_id == null) {
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
                product_id: data.package_id,
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
                product_id: data.package_id,
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
      this.notification = { show: true, type, message }
      setTimeout(() => (this.notification.show = false), 3000)
    },
    async validation() {
      let count = 0

      this.rules.opex_name = !this.opex_name
      this.rules.opex_price = !this.opex_price || this.opex_price <= 0
      this.rules.opex_type = !this.opex_type
      this.rules.customer_id = this.opex_type !== 'internal' && !this.customer_id

      count += Object.values(this.rules).filter((rule) => rule).length
      return count
    },
    async getById(id) {
      await axios.get(GetOpex + '/' + id).then((res) => {
        var data = res.data
        this.opex_name = data.opex_name
        this.opex_price = data.opex_price
        this.opex_type = data.opex_type
        this.customer_id = data.customer_id
        this.customer_name = data.customer.customer_name
        this.issue_at = data.issue_at
        this.due_at = data.due_at
        this.termin = data.termin
        // this.vendor_id = data.vendor_id
        // this.vendor_name = data.vendor.vendor_name
        this.deposit = data.deposit
        console.log('Data', data)
        if (data.id_po) {
          this.getDetailSo(data.id_po)
        }
      })
    },
    async onSubmit() {
      const result = await this.validation()
      if (result === 0) {
        this.isSubmitting = true
        axios
          .post(AddOpex + '/' + 'absorb', {
            customer_id: this.customer_id,
            opex_name : this.opex_name,
            opex_price: this.opex_price,
            opex_type : this.opex_type,
            sales_order_details: this.sales_order_details,            
          })
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Data has been saved',
            }).then(() => router.push('/opex-absorb'))
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.response?.data?.message || error.message,
            })
          })
          .finally(() => {
            this.isSubmitting = false
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
