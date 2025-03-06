<template>
  <AdminLayout>
    <Form
      @submit="onSubmit"
      class="container mx-auto px-6 py-4">
      <!-- Notification -->
      <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
        @close="notification.show = false" />

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-md mb-6">
        <div class="flex justify-between items-center p-6 border-b">
          <div class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800">Create New Inquiry</h1>
            <p class="text-gray-500 text-sm mt-1">Others / Inquiry / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/inquiry"
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Issue Date -->
          <FormGroup label="Issue Date" :required="true" :error="rules.issue_at" errorMessage="Issue Date is required">
            <input type="date" id="issue_at" name="issue_at" v-model="issue_at" :class="inputClass(rules.issue_at)" />
          </FormGroup>

          <!-- Due Date -->
          <FormGroup label="Due Date" :required="true" :error="rules.due_at" errorMessage="Due Date is required">
            <input type="date" id="due_at" name="due_at" v-model="due_at" :class="inputClass(rules.due_at)" />
          </FormGroup>
          <!-- No -->
          <FormGroup class="mt-5" label="Customer" :required="true" :error="rules.customer_id"
            errorMessage="Customer is Required">
            <select name="customer_id" id="customer_id" v-model="customer_id" class="rounded w-full">
              <option v-for="customer in customers" :key="customers.customer_id" :value="customer.customer_id">
                {{ customer.customer_name }}
              </option>
            </select>
          </FormGroup>
          <!-- Code PO -->
          <FormGroup class="mt-5" label="Employee" :required="true" :error="rules.id_payment_type"
            errorMessage="Employee is Required">
            <select name="id_payment_type" id="id_payment_type" v-model="employee_id" class="rounded w-full">
              <option v-for="employee in employees" :key="employee.employee_id" :value="employee.employee_id">
                {{ employee.employee_name }}
              </option>
            </select>
          </FormGroup>
        </div>
        <div class="flex justify-content-between gap-4 items-end mt-8">
          <FormGroup class="w-full" label="product" :required="true" :error="rules.product_id"
            errorMessage="product_id is required">
            <select id="product_id" product name="product_id" v-model="product_id" class="rounded w-full">
              <option v-for="product in products" :key="product.product_id" :value="product.product_id">
                {{ product.product_sn }} - {{ product.product_desc }}
              </option>
            </select>
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
          <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg"
            @click="addPoDetails">tambah</button>
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
              <tr v-for="poDetail in inquiry_details" :key="poDetail.product_id">
                <td class="px-3 py-2 whitespace-no-wrap">
                  <button class="bg-red-300 p-2 px-5 rounded-lg">Delete</button>
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.product_desc }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.quantity }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.price }}</td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between mt-5">
            <div class="w-full"></div>
            <div class="w-full">
              <tr class="flex justify-between">
                <td>Sub Total</td>
                <td>{{ formatCurrency(sub_total) }}</td>
              </tr>
              <tr class="flex justify-between">
                <td>PPN</td>
                <td>{{ formatCurrency(ppn) }}</td>
              </tr>
              <tr class="flex justify-between">
                <td>Grand Total</td>
                <td>{{ formatCurrency(grand_total) }}</td>
              </tr>
            </div>
          </div>
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
import { computed } from 'vue';
import { Customer, Employee, InquiryAdd, Product, SalesOrderAdd } from '@/core/utils/url_api';

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
      employees: [],
      products: [],
      product_id: [],
      quantity: [],
      customer_id: null,
      employee_id: null,
      price: 0,
      termin: "",
      po_type: "",
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
    this.getCustomer();
    this.getEmployee();
    this.getProducts();
  },

  computed: {
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.inquiry_details.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
    },

    // Calculate PPN (11% of subtotal)
    ppn() {
      return this.sub_total * 0.11;
    },

    // Calculate grand total (subtotal + PPN)
    grand_total() {
      return this.sub_total + this.ppn;
    },
  },

  methods: {
    getCustomer() {
      axios.get(Customer).then((res) => {
        var data = res.data;
        this.customers = data;
      })
    },
    getProducts() {
      axios.get(Product).then((res) => {
        var data = res.data;
        this.products = data
      })
    },
    getEmployee() {
      axios.get(Employee).then((res) => {
        var data = res.data;
        this.employees = data;
      })
    },

    addPoDetails() {
      axios
        .get(Product + '/' + this.product_id)
        .then((res) => {
          var data = res.data;
          var object = {
            product_id: data.product_id,
            product_desc: data.product_desc,
            quantity: this.quantity,
            price: this.price,
          };
          this.inquiry_details.push(object)
        })

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

    async onSubmit() {      
      const result = 2;     
      if (result != 0) {
        await axios.post(InquiryAdd,{
          customer_id : this.customer_id,
          employee_id : this.employee_id,          
          total_tax : this.total_tax,                    
          issue_at : this.issue_at,
          due_at : this.due_at,
          inquiry_details : this.inquiry_details,
        }).then((response) => {
          console.log(response)
          Swal.fire({
            icon: "success",
            title: 'Success',
            text: "Data has been Saved"
          }).then(async (result) => {
            if (result.isConfirmed) {
              var mssg = "";
              if (this.id != null) {
                mssg = "Success Update Employee";
              } else {
                mssg = "Success Create Employee";
              }
              await router.push("/employee");
              this.alertStore.success(mssg);
            }
          })
        },
          (error) => {
            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                (error.response &&
                  error.response &&
                  error.response.message) ||
                error.message ||
                error.toString(),
            });
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
