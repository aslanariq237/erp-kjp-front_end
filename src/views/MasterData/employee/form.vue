<!-- eslint-disable vue/block-lang -->
<template>
  <AdminLayout>
      <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
          <!-- Notification -->
          <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
              @close="notification.show = false" />

          <!-- Header Card -->
          <div class="bg-white rounded-lg shadow-md mb-6">
              <div class="flex justify-between items-center p-6 border-b">
                  <div class="breadcrumb">
                      <h1 class="text-2xl font-bold text-gray-800">Create New Employee</h1>
                      <p class="text-gray-500 text-sm mt-1">Master Data / Employee / Form</p>
                  </div>
                  <div class="flex items-center gap-3">
                      <RouterLink to="/employee"
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
              <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
                  <!-- No -->
                  <!-- Total Service -->
                  <!-- Issue Date -->
                  <FormGroup label="Employee Name" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="text" id="issue_at" name="issue_at" v-model="employee_name"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup> 
                  <FormGroup label="Employee Phone" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="number" id="issue_at" name="issue_at" v-model="employee_phone"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup>  
                  <FormGroup label="Employee Email" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="text" id="issue_at" name="issue_at" v-model="employee_email"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup>  
                  <FormGroup label="Employee Nik" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="number" id="issue_at" name="issue_at" v-model="employee_nik"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup>  
                  <FormGroup label="Employee Position" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="text" id="issue_at" name="issue_at" v-model="employee_position"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup>  
                  <FormGroup label="Employee Address" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="text" id="issue_at" name="issue_at" v-model="employee_address"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup>  
                  <FormGroup label="Bpjs Kesehatan" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="text" id="issue_at" name="issue_at" v-model="bpjs_kesehatan"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup> 
                  <FormGroup label="Bpjs Ketenagakerjaan" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="text" id="issue_at" name="issue_at" v-model="bpjs_ketenagakerjaan"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup> 
                  <FormGroup label="Salary" :required="true" :error="rules.issue_at"
                      errorMessage="Issue Date is required">
                      <input type="text" id="issue_at" name="issue_at" v-model="employee_salary"
                          :class="inputClass(rules.issue_at)" />
                  </FormGroup>                                   
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
import { AddAsset, EmployeeCode, Vendor } from '@/core/utils/url_api'
import router from '@/router'

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
        employee_name : '',
        employee_phone : 0,
        employee_email : '',
        employee_nik : 0,
        employee_position : '',
        employee_address : '',
        bpjs_kesehatan : '',
        bpjs_ketenagakerjaan : '',   
        empoyee_salary: 0,       
          //others
          isSubmitting: false,
          notification: {
              show: false,
              type: 'success',
              message: '',
          },
          rules: {
              vendor_id: false,
              id_payment_type: false,
          },
          sales_order_details: [],
      }
  },

  methods: {
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

          if (this.vendor_id == '' || this.vendor_id == null) {
              this.rules.vendor_id = true
              count++
          } else {
              this.rules.vendor_id = false
          }

          return count
      },

      async onSubmit() {
          const result = 2
          if (result != 0) {
              await axios
                  .post(EmployeeCode, {
                      employee_name : this.employee_name,
                      employee_phone : this.employee_phone,
                      employee_email : this.employee_email,
                      employee_nik : this.employee_nik,
                      employee_position : this.employee_position,
                      employee_address : this.employee_address,
                      employee_salary : this.employee_salary,
                      bpjs_kesehatan : this.bpjs_kesehatan,
                      bpjs_ketenagakerjaan : this.bpjs_ketenagakerjaan,                      
                  })
                  .then(
                      (response) => {
                          console.log(response)
                          Swal.fire({
                              icon: 'success',
                              title: 'Success',
                              text: 'Data has been Saved',
                          });
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

<style scoped>
/* Add your styles here */
</style>