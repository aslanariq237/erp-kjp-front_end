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
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Create New Delivery Order</h1>
            <p class="text-gray-500 text-sm mt-1">Others / Delivery Order / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/delivery-order"
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
      <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Issue Date -->
          <FormGroup label="Issue Date" :required="true" :error="rules.issue_at" errorMessage="Issue Date is required">
            <input type="date" id="issue_at" name="issue_at" v-model="issue_at" :class="inputClass(rules.issue_at)" />
          </FormGroup>

          <!-- Due Date -->
          <FormGroup label="Due Date" :required="true" :error="rules.due_at" errorMessage="Due Date is required">
            <input type="date" id="due_at" name="due_at" v-model="due_at" :class="inputClass(rules.due_at)" />
          </FormGroup>
          <!-- Id_Purchase order -->
          <FormGroup label="Sales Order" :required="true" :error="rules.no" errorMessage="Purchase Order is required">
            <select name="id_so" id="id_so" v-model="id_so" class="rounded w-full" @change="selectedSalesOrder" :class="inputClass(rules.do_type)">
              <option v-for="po in salesOrders" :key="po.id_so" :value="po.id_so">
                {{ po.code_so }}
              </option>
            </select>
            <div class="" v-if="rules.id_so == true">
              <p class="text-red-500 text-sm">Sales Order Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- DO Type -->
          <FormGroup label="Customer" :required="true" :error="rules.customer" errorMessage="DO Type is required">
            <input type="text" v-model="customer_id" hidden>
            <input type="text" id="do_type" name="do_type" v-model="customer_name" :class="inputClass(rules.do_type)"
              placeholder="Enter Customer" />
          </FormGroup>

          <!-- Status Payment -->
          <FormGroup label="Delivery Option" :required="false" errorMessage="Status Payment is required">
            <select name="id_so" id="id_so" v-model="id_customer_point" class="rounded w-full" :class="inputClass(rules.do_type)"
              @change="selectedSalesOrder">
              <option v-for="po in points" :key="po.id_customer_point" :value="po.id_customer_point">
                {{ po.point }}
              </option>
            </select>
            <div class="" v-if="rules.id_customer_point == true">
              <p class="text-red-500 text-sm">Customer Point Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- Alamat -->
          <FormGroup label="Alamat" :required="false" errorMessage="Sub Total is required">
            <input type="text" id="alamat" name="alamat" v-model="customer_address" :class="inputClass(rules.alamat)"
              placeholder="Enter Alamat" />
          </FormGroup>
        </div>
        <div class=" mt-8">
          <p class="text-red-500 font-semibold">{{ errorMessage }}</p>
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
            <thead>
              <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                <th class="px-3 py-2 font-semibold border-b">PN</th>
                <th class="px-3 py-2 font-semibold border-b">Product Desc</th>
                <th class="px-3 py-2 font-semibold border-b">brand</th>
                <th class="px-3 py-2 font-semibold border-b">Quantity</th>
                <th class="px-3 py-2 font-semibold border-b">Product Price</th>
                <th class="px-3 py-2 font-semibold border-b">Checklist</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr 
                v-for="products in sales_order_details" 
                :key="products.product_id"
                class="text-center dark:bg-gray-800 dark:text-gray-400"
              >
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.product_sn }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.product_desc }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.product_brand }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <input 
                    type="text" 
                    v-model="products.quantity_left" 
                    class="w-20 rounded-lg border-gray-200 text-center"
                    @change="changeQuantity(products)" 
                    :disabled="products.has_do === 1"
                    :max="products.product_stock">
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(products.price) }}</td>
                <td>
                  <input 
                    type="checkbox"                     
                    name="check_barang" 
                    id="check_barang" 
                    v-model="products.id_so"                    
                    :disabled="products.product_stock == 0 || products.has_do === 1" 
                    @change="AddDeliverOrderDetails(products)
                  ">
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
import Notification from '@/components/Notification.vue'
import FormGroup from '@/components/FormGroup.vue'
import { computed } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios'
import {
  AddDeliveryOrder,
  Customer,
  DetailSo,
  Employee,
  SalesOrders
} from '@/core/utils/url_api'
import router from '@/router'
import { useAuthStore } from '@/stores/authStores'

export default defineComponent({
  name: 'DeliveryOrderForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
  },

  data() {
    const {user} = useAuthStore();
    return {
      user: user,
      salesOrders: [],
      employee: [],
      points: [],
      sales_order_details: [],
      delivery_order_details: [],
      id_so: null,
      id_customer_point: null,
      customer_id: null,
      employee_id: null,
      customer_name: '',
      customer_npwp: 0,
      customer_address: '',
      checklist_prod: 0,
      issue_at: '',
      due_at: '',
      isSubmitting: false,
      errorMessage: '',
      rules : {
        id_so : false,
        id_customer_point : false,
        delivery_order_details : false,
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
    this.employee_id = this.user.employee_id;    
    this.getSalesOrder();
    this.issue_at = new Date().toLocaleDateString('en-CA');
  },

  computed: {
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.sales_order_details.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
    },
  },

  methods: {
    changeQuantity(product) {
      if (product.quantity_left > product.product_stock) {
        this.errorMessage = `Stok produk ${product.product_desc} tidak mencukupi!`;
        product.quantity_left = product.product_stock;
      }else{
        this.errorMessage = '';
      }
      product.amount = product.price * product.quantity;
    },
    getSalesOrder() {
      axios.get(SalesOrders).then((res) => {
        var data = res.data;        
        data = data.filter(detail => detail.has_invoice == 0);
        this.salesOrders = data;
      })
    },
    getDeliveryOption(id) {
      axios.get(Customer + '/point/' + id).then((res) => {
        var data = res.data;
        this.points = data;
      })
    },
    selectedSalesOrder() {
      axios.get(SalesOrders + '/' + this.id_so).then((res) => {
        var data = res.data;
        this.customer_id = data.customer.customer_id;
        this.customer_name = data.customer.customer_name;
        this.customer_npwp = data.customer.customer_npwp;
        this.customer_address = data.customer.customer_address;
        this.due_at = data.due_at;        
        if (data.customer.customer_id) {
          this.getDeliveryOption(data.customer.customer_id)
          if (this.id_customer_point) {
            if (data.id_so) {
              this.SelectDataPo(data.id_so)
            }
          }
        }
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },

    SelectDataPo(id) {
      this.sales_order_details.splice(0);
      if (id != null) {
        axios.get(DetailSo + '/' + id).then(
          (res) => {
            var data = res.data;
            if (!Array.isArray(data)) {
              data = data.data || [data]
            }

            for (let i = 0; i < data.length; i++) {
              let detail = data[i];
              var newObject = {
                id_detail_so: detail.id_detail_so,
                id_so: detail.id_so,
                product_id: detail.product_id,
                product_desc: detail.product.product_desc,
                product_brand: detail.product.product_brand,                
                product_stock: detail.product.product_stock,
                product_sn: detail.product.product_sn,
                has_do : detail.has_do,
                quantity: detail.quantity,
                quantity_left: detail.quantity - detail.quantity_left,
                price: detail.price,
              }
              this.sales_order_details.push(newObject)              
            }
          }
        )
      }
    },
    async AddDeliverOrderDetails(products) {      
      if (products.quantity_left > products.product_stock) 
      {
        this.errorMessage = `Stok produk ${products.product_desc} tidak mencukupi!`;
        products.quantity_left = products.product_stock;        
      }
      else if (products.quantity_left > products.quantity && products.product_stock >= products.quantity) 
      {
        products.quantity_left = products.quantity
      }      

        var objectInclude = {
          id_detail_so : products.id_detail_so,
          product_id: products.product_id,
          quantity: products.quantity,
          quantity_left: products.quantity_left,
          price: products.price
        }
        this.delivery_order_details.push(objectInclude);               
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
      if (this.id_so == '' || this.id_so == null) {
        this.rules.id_so = true;
        count++;
      }        else{
        this.rules.id_so = false;
      }   

      if (this.id_customer_point == '' || this.id_customer_point == null) {
        this.rules.id_customer_point = true;
        count++;        
      }else{
        this.rules.id_customer_point = false;
      }

      if (this.delivery_order_details.length == 0) {
        Swal.fire({
          text: "Tambahkan 1 atau lebih barang!",
          icon : 'error',
          buttonsStyling: true,
          confirmButtonText: 'Try Again!',
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        });
        count++;
      }

      return count
    },

    async onSubmit() {
      const result = await this.validation()                  
      if (result == 0) {
        await axios.post(AddDeliveryOrder, {
          customer_id: this.customer_id,
          id_customer_point: this.id_customer_point,
          employee_id: this.employee_id,
          id_so: this.id_so,
          issue_at: this.issue_at,
          due_at: this.due_at,
          delivery_order_details: this.delivery_order_details,
        }, {
          headers: { "Content-Type": "application/json" }
        }).then((response) => {
          Swal.fire({
            icon: "success",
            title: 'Success',
            text: "Data has been Saved"
          }).then(async (result) => {
            if (result.isConfirmed) {              
              await router.push("/delivery-order");              
            }
          })
        }, (error) => {
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
        'w-full dark:bg-gray-800 dark:text-gray-400 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
        error
          ? 'border-red-300 focus:ring-red-500 bg-red-50'
          : 'border-gray-300 focus:ring-blue-500',
      ]
    },
  },
})
</script>
