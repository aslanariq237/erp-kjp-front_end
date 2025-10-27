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
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">{{ id?'Edit Faktur Pajak' :'Create New Faktur Pajak'  }}</h1>
            <p class="text-gray-500 text-sm mt-1">Finance Tools / Faktur Pajak / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/faktur-pajak"
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
           <FormGroup 
            label="No Faktur Pajak" 
            :required="true" 
            :error="rules.code_faktur_pajak" 
            errorMessage="Code Faktur Pajak is required"
          >
            <input 
              type="text" 
              id="alamat" 
              name="alamat" 
              autocomplete="off" 
              v-model="code_faktur_pajak" 
              :class="inputClass(rules.alamat)"
              placeholder="Enter Faktur pajak" 
            />
          </FormGroup>
          <FormGroup 
            label="Customer" 
            class="relative" 
            :required="true"
          >
          <input type="hidden" v-model="customer_id">
            <input 
              type="text" 
              autocomplete="off" 
              name="customer_name" 
              id="customer_name" 
              v-model="customer_name"
              @input="filterCustomers" 
              class="rounded w-full" 
              placeholder="Type customer name"
              :class="inputClass(rules.issue_at)" 
            />
            <ul 
              v-if="filteredCustomers.length && customer_name"
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
              <li v-if="filteredCustomers.length === 0">
                not found
              </li>
            </ul>
            <div class="" v-if="rules.customer_id == true">
              <p class="text-red-500 text-sm">Customer Dibutuhkan</p>
            </div>
          </FormGroup>    
          <FormGroup
            label="Invoice"
            :required="true"                  
          >
            <select 
              name="id_invoice" 
              id="id_invoice"
              class="rounded w-full"
              v-model="selected_id_invoice"
              @change="selectInvoice"          
              :class="inputClass(rules.alamat)"
            >
              <option value="" selected>select an option</option>
              <option 
                v-for="data in invoices"
                :key="data.id_invoice"
                :value="data.id_invoice"                
                :class="inputClass(rules.alamat)"
              >
                {{ data.code_invoice }}
              </option>
            </select>
          </FormGroup> 
          <FormGroup 
            label="Po Number" 
            :required="false" 
            :error="rules.code_faktur_pajak" 
            errorMessage="Po Number is required"
          >
            <input 
              type="text" 
              id="code_po" 
              name="code_po" 
              autocomplete="off" 
              v-model="po_number" 
              readonly
              :class="inputClass(rules.alamat)"
              placeholder="Enter Faktur pajak" 
            />
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
import {
  Customer,
  Invoice,
  GetFakturPajak,
  AddFakturPajak
} from '@/core/utils/url_api'
import router from '@/router'
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
    return {
      id: null,
      customer_id: null,
      id_invoice: null,
      selected_id_invoice: null,
      id_so: null,
      customer_name: '',
      code_faktur_pajak: '',
      po_number: '',            
      customers: [],
      invoices: [],
      filteredCustomers: [],           
      isSubmitting: false,
      notification: {
        show: false,
        type: 'success',
        message: '',
      },
      rules: {
        code_faktur_pajak : false,
        id_so : false,
        deliveryOrders : false,
      },
    }
  },
  async mounted() {
    const route = useRoute();
    const id = route.params.id;
    this.total = this.sub_total;        
    this.getCustomer();
    if (id) {
      this.getById(id);      
      this.id = id;
    } else {      
      this.issue_at = new Date().toLocaleDateString('en-CA');
    }
  },
  methods: {
    async getCustomer(){
      ApiServices.get(Customer).then(
        (res) => {
          var data = res.data;
          this.customers = data;          
        }
      )
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

      this.getDeliveryOrder(this.customer_id);
    },

    selectInvoice(){
      const selected = this.invoices.find(inv => inv.id_invoice == this.selected_id_invoice);      
      this.id_invoice = selected.id_invoice;            
      if (selected.detail_inv && selected.detail_inv.length > 0) {
        const firstDetail = selected.detail_inv[0];
        this.id_so = firstDetail.id_so;
        this.po_number = firstDetail.so.po_number;
      }else{
        console.warn('Invoice Tidak Memiliki detail_inv');
      }
    },

    changeQuantity(products) {
      products.amount = products.price * products.quantity;
    },                  

    getDeliveryOrder(id) {      
      ApiServices.get(Invoice + '/faktur/' + id).then((res) => {
        var data = res.data
        if (!this.id) {
          data = data.filter((i) => i.has_faktur != 1)                        
        }
        this.invoices = data;             
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
      await ApiServices.get(GetFakturPajak + '/' + id).then(        
        (res) => {
          var data = res.data;              
          this.code_faktur_pajak = data[0].code_faktur_pajak;
          this.customer_id = data[0].customer_id;
          this.customer_name = data[0].so.customer.customer_name;          
          this.id_invoice = data[0].id_invoice;
          this.po_number = data[0].so.po_number;
          this.selected_id_invoice = data[0].id_invoice;        
          this.id_so = data[0].id_so;          
          this.getDeliveryOrder(this.customer_id);
          // this.selectInvoice();
        }
      )
    },
    async validation() {
      var count = 0
      if (this.id_so == '' || this.id_so == null) {
        this.rules.id_so = true
        count++
      } else {
        this.rules.id_so = false
      }

      if (this.code_faktur_pajak == '' || this.code_faktur_pajak == null) {
        this.rules.code_faktur_pajak = true
        count++
      } else {
        this.rules.code_faktur_pajak = false
      }          

      return count
    },

    async onSubmit() {
      const result = await this.validation();      
      if (result == 0) {
        if (this.id == null) {
          await ApiServices.post(AddFakturPajak, {
            id_so: this.id_so,
            id_invoice: this.id_invoice,
            customer_id: this.customer_id,                               
            code_faktur_pajak : this.code_faktur_pajak,
          }, {
            headers: { "Content-Type": "application/json" }
          }).then((response) => {            
            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Data has been Saved"
            }).then(async (result) => {
              if (result.isConfirmed) {
                await router.push("/faktur-pajak");
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
          await ApiServices.put(AddFakturPajak + '/' + this.id, {
            id_so : this.id_so,
            id_invoice : this.id_invoice,
            customer_id : this.customer_id,
            code_faktur_pajak : this.code_faktur_pajak
          }, {
            headers: { "Content-Type": "application/json" }
          }).then((response) => {            
            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Data has been Saved"
            }).then(async (result) => {
              if (result.isConfirmed) {
                await router.push("/faktur-pajak");
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