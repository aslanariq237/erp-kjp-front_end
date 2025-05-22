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
            <h1 class="text-2xl font-bold text-gray-800">{{ id ? "Edit Opex Internal" : "Create New Opex Internal" }}
            </h1>
            <p class="text-gray-500 text-sm mt-1">Finance Tools / Opex Internal / Form</p>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/opex-internal"
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
          <FormGroup label="Issue Date" :required="true" :error="rules.customerName" errorMessage="Opex is required">
            <input type="date" id="issue_at" name="issue_at" v-model="issue_at" min="0" :class="[
              'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
              rules.amount
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:ring-blue-500',
            ]" placeholder="Enter Issue Date" />
          </FormGroup>

          <FormGroup>
          </FormGroup>

          <FormGroup label="Opex" :required="true" :error="rules.customerName" errorMessage="Opex is required">
            <input type="text" id="name" name="name" v-model="opex_name" min="0" :class="[
              'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
              rules.amount
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:ring-blue-500',
            ]" placeholder="Enter Opex Name" />
            <div class="" v-if="rules.opex_name == true">
              <p class="text-red-500 text-sm">Opex Name Dibutuhkan</p>
            </div>
          </FormGroup>

          <!-- Amount -->
          <FormGroup label="Price" :required="true" :error="rules.amount"
            errorMessage="Amount is required and must be greater than 0">
            <input type="number" id="amount" name="amount" v-model="opex_price" min="0" :class="[
              'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
              rules.amount
                ? 'border-red-300 focus:ring-red-500 bg-red-50'
                : 'border-gray-300 focus:ring-blue-500',
            ]" placeholder="Enter price" />
            <div class="" v-if="rules.opex_price == true">
              <p class="text-red-500 text-sm">Opex Price Dibutuhkan</p>
            </div>
          </FormGroup>
          <!-- Due Date -->
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
import axios from 'axios'
import { AddOpex, GetOpex } from '@/core/utils/url_api'
import router from '@/router'
import Swal from 'sweetalert2'
import { Customer } from '@/core/utils/url_api'

export default defineComponent({
  name: 'AccountReceivableForm',
  components: {
    AdminLayout,
    Form,
    Notification,
    FormGroup,
  },

  data() {
    return {
      id: null,
      opex_name: '',
      opex_price: 0,
      opex_type: 'internal',
      customers: [],
      customer_name: '',
      filteredCustomers: [],
      issue_at: '',
      due_at: '',
      customer_id: null,
      isSubmitting: false,
      rules: {
        opex_name: false,
        opex_price: false,
        opex_type: false,
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
    const route = useRoute();
    const id = route.params.id;
    if (id) {
      this.getById(id);
      this.id = id;
    }
    this.issue_at = new Date().toLocaleDateString('en-CA')
  },

  methods: {
    getCustomer() {
      axios.get(Customer).then((res) => {
        var data = res.data
        this.customers = data
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

      if (this.opex_name == '' || this.opex_name == null) {
        this.rules.opex_name = true;
        count++;
      } else {
        this.rules.opex_name == false;
      }

      if (this.opex_price == '' || this.opex_price == 0) {
        this.rules.opex_price = true;
        count++;
      } else {
        this.rules.opex_price = false;
      }

      return count
    },
    async getById(id) {
      await axios.get(GetOpex + '/' + id).then((res) => {
        var data = res.data;
        this.opex_name = data.opex_name;
        this.opex_price = data.opex_price;
        this.issue_at = data.issue_at;
      })
    },

    async onSubmit() {
      const result = await this.validation();
      if (result == 0) {
        if (!this.id) {
          await axios.post(AddOpex, {
            customer_id: this.customer_id,
            opex_name: this.opex_name,
            opex_price: this.opex_price,
            opex_type: this.opex_type,
            issue_at: this.issue_at,
          }).then((response) => {
            console.log(response)
            Swal.fire({
              icon: "success",
              title: 'Success',
              text: "Data has been Saved"
            }).then(async (result) => {
              if (result.isConfirmed) {
                await router.push("/opex-internal");
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
        }else{
          await axios.put(AddOpex + '/' + this.id, {
          customer_id: this.customer_id,
          opex_name: this.opex_name,
          opex_price: this.opex_price,
          opex_type: this.opex_type,
          issue_at : this.issue_at,
          
        }).then((response) => {
          console.log(response)
          Swal.fire({
            icon: "success",
            title: 'Success',
            text: "Data has been Saved"
          }).then(async (result) => {
            if (result.isConfirmed) {
              await router.push("/opex-internal");
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
  },
})
</script>
