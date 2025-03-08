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
          <div class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Create New Tanda Terima</h1>
            <p class="text-gray-500 text-sm mt-1">Sales / Tanda Terima / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink
              to="/tandater"
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

          >            
          </FormGroup>
          <!-- Id_Purchase order -->
          <FormGroup
            label="Invoice Number"
            :required="true"
            :error="rules.no"
            errorMessage="Purchase Order is required"
          >
            <select
              name="id_so"
              id="id_so"
              v-model="id_so"
              class="rounded w-full"
              @change="selectedSalesOrder"
            >
              <option v-for="po in salesOrders" :key="po.id_so" :value="po.id_so">
                {{ po.code_so }}
              </option>
            </select>
          </FormGroup>
          <!-- DO Type -->
          <FormGroup
            label="Customer"
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
              class="rounded w-full"
              placeholder="Type customer name"
            />
            <ul v-if="filteredCustomers.length" class="border rounded w-full mt-2 bg-white">
              <li
                v-for="customer in filteredCustomers"
                :key="customer.customer_id"
                @click="selectCustomer(customer)"
                class="p-2 cursor-pointer hover:bg-gray-200"
              >
                {{ customer.customer_name }}
              </li>
            </ul>
          </FormGroup>

          <!-- Status Payment -->
          <FormGroup label="Resi Pengiriman" :required="false" errorMessage="Status Payment is required">
            <input
              type="text"
              id="status_payment"
              name="status_payment"
              v-model="resi"
              :class="inputClass(rules.status_payment)"
              placeholder="Nomor Resi"
            />
          </FormGroup>

          <!-- Alamat -->
          <FormGroup label="Alamat" :required="false" errorMessage="Sub Total is required">
            <input
              type="text"
              id="alamat"
              name="alamat"
              v-model="customer_address"
              :class="inputClass(rules.alamat)"
              placeholder="Enter Alamat"
            />
          </FormGroup>
          <FormGroup> </FormGroup>
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
import Swal from 'sweetalert2'
import axios from 'axios'
import { computed } from 'vue'
import {
  DeliverSales,
  DetailDo,
  InvoiceAdd,
  SalesOrders,
  Employee,
  Customer,
} from '@/core/utils/url_api'

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
      salesOrders: [],
      deliveryOrders: [],
      customers: [],
      employee: [],
      filteredCustomers: [],
      employees: [],
      filteredEmployees: [],
      customer_name: '',
      employee_name: '',
      delivery_order_details: [],
      delivery_order_details: [],
      id_so: null,
      id_do: null,
      customer_id: null,
      employee_id: null,
      customer_name: '',
      resi: '',
      customer_address: '',
      employee_name: '',
      checklist_prod: 0,
      issue_at: '',
      due_at: '',
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {},
    }
  },
  async mounted() {
    this.getSalesOrder()
    this.getCustomer()
    this.getEmployee()
    this.issue_at = new Date().toLocaleDateString('en-CA')

  },
  computed: {
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.delivery_order_details.reduce((total, item) => {
        return total + item.quantity * item.price
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
    getSalesOrder() {
      axios.get(SalesOrders).then((res) => {
        var data = res.data
        this.salesOrders = data
      })
    },
    getCustomer() {
      axios.get(Customer).then((res) => {
        this.customers = res.data
      })
    },
    getEmployee() {
      axios.get(Employee).then((res) => {
        this.employees = res.data
      })
    },
    selectedSalesOrder() {
      axios.get(SalesOrders + '/' + this.id_so).then((res) => {
        var data = res.data
        this.customer_id = data.customer.customer_id
        this.customer_name = data.customer.customer_name
        this.customer_npwp = data.customer.customer_npwp
        this.customer_address = data.customer.customer_address
        this.employee_id = data.employee.employee_id
        this.employee_name = data.employee.employee_name

        if (data.id_so) {
          this.getDeliveryOrder(data.id_so)
        }
      })
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

    getDeliveryOrder(id) {
      axios.get(DeliverSales + '/' + id).then((res) => {
        var data = res.data
        this.deliveryOrders = data
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },

    addDoDetail() {
      axios.get(DetailDo + '/' + this.id_do).then((res) => {
        var data = res.data
        for (let i = 0; i < data.length; i++) {
          var object = {
            id_detail_do: data[i].id_detail_do,
            id_do: data[i].id_do,
            product_id: data[i].product_id,
            product_desc: data[i].product.product_desc,
            product_pn: data[i].product.product_sn,
            product_brand: data[i].product.product_brand,
            quantity: data[i].quantity,
            price: data[i].price,
          }
          this.delivery_order_details.push(object)
        }
      })
    },

    // SelectDataPo(id) {
    //   this.delivery_order_details.splice(0);
    //   if (id != null) {
    //     axios.get(DetailDo + '/' + id).then(
    //       (res) => {
    //         var data = res.data;
    //         if (!Array.isArray(data)) {
    //           data = data.data || [data]
    //         }
    //         for (let i = 0; i < data.length; i++) {
    //           let detail = data[i];
    //           var newObject = {
    //             id_detail_do: detail.id_detail_do,
    //             id_do: detail.id_do,
    //             product_id: detail.product_id,
    //             product_desc: detail.product.product_desc,
    //             product_brand: detail.product.product_brand,
    //             product_sn: detail.product.product_sn,
    //             quantity: detail.quantity,
    //             price: detail.price,
    //           }
    //           this.delivery_order_details.push(newObject)
    //         }
    //       }
    //     )
    //   }
    // },
    // async AddDeliverOrderDetails(products) {
    //   for (let i = 0; i < [products].length; i++) {
    //     var objectInclude = {
    //       product_id: products.product_id,
    //       quantity: products.quantity,
    //       price: products.price
    //     }
    //     this.delivery_order_details.push(objectInclude);
    //   }
    // },
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
      const result = await this.validation()
      if (result != 0) {
        await axios
          .post(
            InvoiceAdd,
            {
              customer_id: this.customer_id,
              employee_id: this.employee_id,
              issue_at: this.issue_at,
              due_at: this.due_at,
              id_do: this.id_do,
              delivery_order_details: this.delivery_order_details,
            },
            {
              headers: { 'Content-Type': 'application/json' },
            },
          )
          .then(
            (response) => {
              console.log(response)
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data has been Saved',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  var mssg = ''
                  if (this.id != null) {
                    mssg = 'Success Update Employee'
                  } else {
                    mssg = 'Success Create Employee'
                  }
                  await router.push('/employee')
                  this.alertStore.success(mssg)
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
