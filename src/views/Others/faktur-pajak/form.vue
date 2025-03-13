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
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Create New Faktur Pajak</h1>
            <p class="text-gray-500 text-sm mt-1">Finance Tools / Faktur Pajak / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/invoice"
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
          <!-- Id_Purchase order -->
          <FormGroup label="Sales Order" :required="true" :error="rules.no" errorMessage="Purchase Order is required">
            <select name="id_so" id="id_so" v-model="id_so" class="rounded w-full" @change="selectedSalesOrder"
              :class="inputClass(rules.due_at)">
              <option v-for="po in salesOrders" :key="po.id_so" :value="po.id_so" :class="inputClass(rules.due_at)">
                {{ po.code_so }}
              </option>
            </select>
          </FormGroup>
          <FormGroup label="Po Number" :required="true" :error="rules.customer" errorMessage="DO Type is required">
            <input type="text" v-model="customer_id" hidden>
            <input type="text" id="do_type" name="do_type" v-model="po_number" :class="inputClass(rules.do_type)"
              placeholder="Po Number" />
          </FormGroup>
          <!-- DO Type -->
          <FormGroup label="Customer name" :required="true" :error="rules.customer" errorMessage="DO Type is required">
            <input type="text" v-model="customer_id" hidden>
            <input type="text" id="do_type" name="do_type" v-model="customer_name" :class="inputClass(rules.do_type)"
              placeholder="Customer Name" />
          </FormGroup>

          <!-- Alamat -->
          <FormGroup label="No Faktur Pajak" :required="false" errorMessage="Sub Total is required">
            <input type="text" id="alamat" name="alamat" v-model="faktur_pajak" :class="inputClass(rules.alamat)"
              placeholder="Enter Faktur pajak" />
          </FormGroup>
          <FormGroup>
          </FormGroup>
        </div>
        <div class="flex items-end gap-5">
          <FormGroup label="Invoice" :required="true" :error="rules.no" class="w-full"
            errorMessage="Purchase Order is required">
            <select name="id_so" id="id_so" v-model="id_invoice" class="rounded w-full" :class="inputClass(rules.due_at)">
              <option v-for="delo in deliveryOrders" :key="delo.id_invoice" :value="delo.id_invoice">
                {{ delo.code_invoice }}
              </option>
            </select>
          </FormGroup>
        </div>        
      </div>
    </Form>
  </AdminLayout>
</template>

<script>
import { defineComponent } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Form } from 'vee-validate'
import { RouterLink, useRoute } from 'vue-router'
import Notification from '@/components/Notification.vue'
import FormGroup from '@/components/FormGroup.vue'
import Swal from 'sweetalert2'
import axios from 'axios'
import { computed } from 'vue'
import {
  AddFakturPajak,
  Invoice,
  InvoiceAdd,
  SalesOrders,
  TandaterAdd
} from '@/core/utils/url_api'
import router from '@/router'

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
      id: null,    
      salesOrders : [],  
      deliveryOrders: [],
      code_invoice: '',
      id_so: null,
      id_invoice: null,
      customer_id: null,      
      po_number: '',
      faktur_pajak : '',      
      customer_name: '',
      customer_npwp: 0,
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
      rules: {

      },
    }
  },
  async mounted() {
    const route = useRoute();
    const id = route.params.id;
    this.total = this.sub_total;
    this.getSalesOrder();
    if (id) {
      this.getById(id);
      this.id = id;
    } else {
      this.issue_at = new Date().toLocaleDateString('en-CA');
    }
  },
  methods: {
    changeQuantity(products) {
      products.amount = products.price * products.quantity;
    },
    getSalesOrder() {
      axios.get(SalesOrders).then((res) => {
        var data = res.data;
        this.salesOrders = data;
      })
    },
    selectedSalesOrder() {
      axios.get(SalesOrders + '/' + this.id_so).then((res) => {
        var data = res.data;
        this.customer_id = data.customer.customer_id;
        this.customer_name = data.customer.customer_name;
        this.customer_npwp = data.customer.customer_npwp;
        this.customer_address = data.customer.customer_address;
        this.employee_id = data.employee.employee_id;
        this.employee_name = data.employee.employee_name;
        this.po_number = data.po_number;
        this.due_at = data.due_at;

        if (data.id_so) {
          this.getDeliveryOrder(data.id_so)
        }
      })
    },

    getDeliveryOrder(id) {
      axios.get(Invoice + '/code/' + id).then((res) => {
        var data = res.data        
        this.deliveryOrders = data;
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

    async validation() {
      var count = 2
      return count
    },

    async getById(id) {
      await axios.get(Invoice + '/' + id).then(
        (res) => {
          var data = res.data;
          this.issue_at = data[0].issue_at;
          this.due_at = data[0].due_at;
          this.po_number = data[0].salesorder.po_number;
          this.id_so = data[0].id_so;
          this.customer_id = data[0].customer_id;
          this.code_invoice = data[0].code_invoice;
          this.customer_name = data[0].customer.customer_name;
          this.customer_address = data[0].customer.customer_address;

          var id = data[0].id_invoice;
          if (id) {
            this.getDetailSo(id);
          }
        }
      )
    },

    async onSubmit() {
      const result = 2;      
      if (result != 0) {
        if (this.id == null) {
          await axios.post(AddFakturPajak, {
            id_so: this.id_so,
            id_invoice: this.id_invoice,
            customer_id: this.customer_id,                               
            code_faktur_pajak : this.faktur_pajak,
          }, {
            headers: { "Content-Type": "application/json" }
          }).then((response) => {
            console.log(response)
            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Data has been Saved"
            }).then(async (result) => {
              if (result.isConfirmed) {
                await router.push("/tanda-terima");
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
        else {
          await axios.put(TandaterAdd + '/' + this.id, {
            id_so: this.id_so,
            customer_id: this.customer_id,
            employee_id: 1,
            issue_at: this.issue_at,            
            due_at: this.due_at,                      
            tandaterima_details: this.tandaterima_details,
          }, {
            headers: { "Content-Type": "application/json" }
          }).then((response) => {
            console.log(response)
            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Data has been Saved"
            }).then(async (result) => {
              if (result.isConfirmed) {
                await router.push("/invoice");
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
<style scoped></style>