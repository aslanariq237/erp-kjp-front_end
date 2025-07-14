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
            <div v-if="id">
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Tanda Terima</h1>
            </div>
            <div v-else>
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Create New Tanda Terima</h1>
            </div>
            <p class="text-gray-500 text-sm mt-1">Sales / Tanda Terima / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/tanda-terima"
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
          <!-- tandaterima code -->
           <FormGroup 
            label="Tanda Terima Code"  
            v-if="id"                     
          >
            <input type="text" autocomplete="off" id="due_at" name="due_at" placeholder="Code Tanda Terima" v-model="code_tandater"
              :class="inputClass(rules.due_at)" />
          </FormGroup>
          <!-- Issue Date -->
          <FormGroup label="Issue Date" :required="true" :error="rules.issue_at" errorMessage="Issue Date is required">
            <input type="date" id="issue_at" name="issue_at" v-model="issue_at" :class="inputClass(rules.issue_at)" />
          </FormGroup>

          <!-- Due Date -->
          <FormGroup label="Resi" :required="true" :error="rules.due_at" errorMessage="Due Date is required">
            <input type="text" autocomplete="off" id="due_at" name="due_at" placeholder="Input Resi" v-model="resi"
              :class="inputClass(rules.due_at)" />
            <div class="" v-if="rules.resi == true">
              <p class="text-red-500 text-sm">Resi Dibutuhkan</p>
            </div>
          </FormGroup>
          <!-- Id_Purchase order -->
          <FormGroup 
            label="Sales Order" 
            :required="true" 
            :error="rules.no" 
            errorMessage="Purchase Order is required"
            v-if="!id"
          >
            <select 
              name="id_so" 
              id="id_so" 
              v-model="id_so" 
              class="rounded w-full" 
              @change="selectedSalesOrder"
              :class="inputClass(rules.due_at)"                
            >
              <option v-for="po in salesOrders" :key="po.id_so" :value="po.id_so" :class="inputClass(rules.due_at)">
                {{ po.code_so }}
              </option>
            </select>
          </FormGroup>
          <FormGroup 
            label="Po Number" 
            :required="true" 
            :error="rules.customer" 
            errorMessage="DO Type is required"
            v-if="!id"
          >
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
          <FormGroup label="Address" :required="false" errorMessage="Sub Total is required">
            <input type="text" id="alamat" name="alamat" v-model="customer_address" :class="inputClass(rules.alamat)"
              placeholder="Enter Address" />
          </FormGroup>
          <FormGroup>
          </FormGroup>
        </div>
        <div v-if="id">
        </div>
        <div class="flex items-end gap-5 mb-8" v-else>
          <FormGroup 
            label="Invoice" 
            :required="true" 
            :error="rules.no" 
            class="w-full"
            errorMessage="Purchase Order is required"
          >
            <select 
              name="id_so" 
              id="id_so" 
              v-model="id_invoice" 
              class="rounded w-full"
              :class="inputClass(rules.due_at)"
            >
              <option 
                v-for="delo in deliveryOrders" 
                :key="delo.id_invoice" 
                :value="delo.id_invoice"
              >
                  {{ delo.code_invoice }}
              </option>
            </select>
          </FormGroup>
          <button class="bg-blue-400 rounded-lg px-3 py-2" type="button" @click="addDoDetail">
            Tambah
          </button>
        </div>
        <div>
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border mt-3">
            <thead>
              <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                <th class="px-3 py-2 font-semibold text-left border-b">Invoice Number</th>
                <th class="px-3 py-2 font-semibold text-left border-b">So Number</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Po Number</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Nominal</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:text-gray-400">
              <tr v-for="products in tandaterima_details" :key="products.product_id">
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.code_invoice }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.code_so }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.po_number }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(products.nominal) }}</td>
              </tr>
            </tbody>
          </table>
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
  DeliverSales,
  DetailDo,
  DetailInvoice,
  DetailSo,
  DetailTandater,
  Invoice,
  InvoiceAdd,
  SalesOrders,
  Tandater,
  TandaterAdd
} from '@/core/utils/url_api'
import router from '@/router'
import { useAuthStore } from '@/stores/authStores'
import ApiServices from '@/core/services/ApiServices'

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
      id: null,
      user : user,
      salesOrders: [],
      deliveryOrders: [],
      employee: [],
      tandaterima_details: [],
      code_invoice: '',
      id_so: null,
      id_invoice: null,
      customer_id: null,
      employee_id: null,
      po_number: '',
      code_so : '',
      code_tandater : '',
      resi: '',
      customer_name: '',
      customer_npwp: 0,
      customer_address: '',
      employee_name: '',
      checklist_prod: 0,
      issue_at: '',
      due_at: '',
      isSubmitting: false,
      rules: {
        resi: false,
        tandaterima_details: false,
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
    const route = useRoute();
    const id = route.params.id;
    this.employee_id = this.user.employee_id;
    
    this.getSalesOrder();
    if (id) {
      this.getById(id);
      this.id = id;
    }else{
      this.issue_at = new Date().toLocaleDateString('en-CA');    
    }      
    this.due_at = new Date().toLocaleDateString('en-CA');
  },
  computed: {
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.tandaterima_details.reduce((total, item) => {
        return total + (item.amount) || 0
      }, 0);
    },
  },
  methods: {
    changeQuantity(products) {
      products.amount = products.price * products.quantity;
    },
    getSalesOrder() {
      ApiServices.get(SalesOrders).then((res) => {
        var data = res.data;
        data = data.filter((res) => res.has_tandater != 1);
        this.salesOrders = data;
      })
    },
    selectedSalesOrder() {
      var selected = this.salesOrders.find(function (item) {
        return item.id_so == this.id_so
      }.bind(this))      

      if (selected) {
        this.due_at = selected.due_at;                  
        this.po_number = selected.po_number,
        this.customer_id = selected.customer_id,
        this.customer_name = selected.customer.customer_name;
        this.customer_address = selected.customer.customer_address;        
        this.code_so = selected.code_so;

        this.getDeliveryOrder();
      }
    },

    getDeliveryOrder() {
      ApiServices.get(Invoice).then((res) => {
        var data = res.data
        this.deliveryOrders = data;
      })
    },

    formatCurrency(value) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
    },

    addDoDetail() {
      if (this.id_invoice == '' || this.id_invoice == null) {
        Swal.fire({
          icon: 'warning',
          text: "Pilih Invoice"
        });
      } else {        
        ApiServices.get(Invoice + '/' + this.id_invoice).then(
          (res) => {
            var data = res.data;
            for (let i = 0; i < data.length; i++) {
              var object = {
                code_invoice: data[i].code_invoice,
                id_invoice: data[i].id_invoice,
                id_so: this.id_so,
                code_so: this.code_so,
                po_number: this.po_number,
                nominal : data[i].grand_total,
              }
              this.tandaterima_details.push(object);
            }
          }
        )
      }
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
      if (this.resi == '' || this.resi == null) {
        this.rules.resi = true;
        count++;
      } else {
        this.rules.resi = false;
      }
      if (this.tandaterima_details.length == 0) {
        Swal.fire({
          text: "Tambahkan 1 atau lebih barang!",
          icon: 'error',
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
    getDetailSo(id) {
      ApiServices.get(DetailTandater + '/' + id).then(
        (res) => {
          var data = res.data;          
          for (let i = 0; i < data.length; i++) {
            var object = {
              code_invoice: data[i].invoice.code_invoice,
              id_invoice: data[i].id_invoice,
              code_so: data[i].so.code_so,
              po_number: data[i].so.po_number,
              nominal : data[i].invoice.grand_total,
            }
            this.tandaterima_details.push(object);
          }
        }
      )
    },
    async getById(id) {
      await ApiServices.get(Tandater + '/' + id).then(
        (res) => {
          var data = res.data;          
          this.issue_at = data[0].issue_at;
          this.resi = data[0].resi;
          this.id_so = data[0].id_so;          
          this.customer_id = data[0].customer_id;
          this.customer_name = data[0].customer.customer_name;
          this.customer_address = data[0].customer.customer_address;
          this.code_tandater = data[0].code_tandater;
          var id = data[0].id_tandater;
          if (id) {
            this.getDetailSo(id);
          }
        }
      )
    },

    async onSubmit() {
      const result = await this.validation();
      if (result == 0) {
        if (this.id == null) {
          await ApiServices.post(TandaterAdd, {            
            customer_id: this.customer_id,
            employee_id : this.employee_id,            
            resi: this.resi,
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
          await ApiServices.put(TandaterAdd + '/' + this.id, {
            id_so: this.id_so,
            customer_id: this.customer_id,
            issue_at : this.issue_at,
            due_at : this.due_at,
            resi : this.resi,
            id_do: this.id_do,
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