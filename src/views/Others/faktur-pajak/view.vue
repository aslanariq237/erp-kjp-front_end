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
              <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">View Faktur Pajak</h1>
              <p class="text-gray-500 text-sm mt-1">Finance Tools / Faktur Pajak / View</p>
            </div>
            <div class="flex items-center gap-3">
              <RouterLink to="/faktur-pajak"
                class="px-4 py-2 text-gray-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center gap-2">
                <i class="fas fa-times"></i>
                Back
              </RouterLink>              
            </div>
          </div>
        </div>
  
        <!-- Form Card -->
        <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:text-gray-400">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">         
            <!-- Id_Purchase order -->
            <FormGroup label="Sales Order">              
              <input 
                type="text" 
                id="do_type" 
                name="do_type" 
                v-model="code_so" 
                readonly
                :class="inputClass(rules.do_type)"
                placeholder="Sales Order" 
            />
            </FormGroup>
            <FormGroup label="Po Number">              
              <input 
                type="text" 
                id="do_type" 
                name="do_type" 
                readonly
                v-model="po_number" 
                :class="inputClass(rules.do_type)"
                placeholder="Po Number" 
            />
            </FormGroup>
            <!-- DO Type -->
            <FormGroup label="Customer name">              
              <input 
                type="text" 
                id="do_type" 
                name="do_type" 
                readonly
                v-model="customer_name" 
                :class="inputClass(rules.do_type)"
                placeholder="Customer Name" 
            />
            </FormGroup>
  
            <!-- Alamat -->
            <FormGroup label="No Faktur Pajak" :required="false" errorMessage="Sub Total is required">
              <input 
                type="text" 
                id="alamat" 
                name="alamat" 
                readonly
                v-model="faktur_pajak" 
                :class="inputClass(rules.alamat)"
                placeholder="Faktur pajak" 
            />            
            </FormGroup>
          </div>
          <div class="flex items-end gap-5 mt-4">
            <FormGroup label="Invoice" class="w-full">
                <input 
                    type="text" 
                    id="alamat" 
                    name="alamat" 
                    v-model="code_invoice" 
                    readonly    
                    :class="inputClass(rules.alamat)"
                    placeholder="Invoice" 
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
  import axios from 'axios'
  import { computed } from 'vue'
  import {
    AddFakturPajak,
    GetFakturPajak,
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
        id_so: null,
        code_invoice: null,
        code_so: null,
        id_invoice: null,        
        customer_id: null,      
        po_number: '',
        faktur_pajak : '',      
        customer_name: '',
        customer_npwp: 0,
        customer_address: '',
        employee_name: '',
        checklist_prod: 0,
        code_invoice: '',
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
        await axios.get(GetFakturPajak + '/' + id).then(        
          (res) => {
            var data = res.data;
            console.log(data)            
            this.po_number = data[0].so.po_number
            this.customer_name = data[0].so.customer.customer_name;
            this.code_invoice = data[0].invoice.code_invoice;          
            this.faktur_pajak = data[0].code_faktur_pajak; 
            this.code_so = data[0].so.code_so;                    
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