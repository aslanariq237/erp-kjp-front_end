<template>
  <AdminLayout>
    <Form @submit="onSubmit" class="container mx-auto px-6 py-4">
      <!-- Notification -->
      <Notification v-if="notification.show" :type="notification.type" :message="notification.message"
        @close="notification.show = false" />

      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-md mb-6 dark:bg-gray-800 dark:text-gray-400">
        <div class="flex justify-between items-center p-6 border-b">
          <div v-if="id" class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">Edit Invoice</h1>
            <p class="text-gray-500 text-sm mt-1">Invoice / Form</p>
          </div>
          <div v-else class="breadcrumb">
            <h1 class="text-2xl font-bold text-gray-800 dark:text-white/90">
              Create New Invoice
            </h1>
            <p class="text-gray-500 text-sm mt-1">Invoice / Form</p>
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
          <FormGroup label="Delivery Order" :required="true" :error="rules.no" class="w-full"
            errorMessage="Purchase Order is required">
            <select name="id_so" id="id_so" v-model="id_do" class="rounded w-full" :class="inputClass(rules.due_at)">
              <option v-for="delo in deliveryOrders" :key="delo.id_do" :value="delo.id_do">
                {{ delo.code_do }}
              </option>
            </select>
          </FormGroup>
          <button class="bg-blue-400 rounded-lg px-3 py-2" type="button" @click="addDoDetail">
            Tambah
          </button>
        </div>
        <div class="">
          <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
            <thead>
              <tr class="text-center dark:bg-gray-800 dark:text-gray-400">
                <th class="px-3 py-2 font-semibold text-left border-b">Do Number</th>
                <th class="px-3 py-2 font-semibold text-left border-b">PN</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Product Desc</th>
                <th class="px-3 py-2 font-semibold text-left border-b">brand</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Quantity</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Price</th>
                <th class="px-3 py-2 font-semibold text-left border-b">Amount</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100 dark:bg-gray-800 dark:text-gray-400">
              <tr v-for="products in delivery_order_details" :key="products.product_id">
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.code_do }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.product_pn }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.product_desc }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ products.product_brand }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">
                  <input type="text" v-model="products.quantity"
                    class="w-20 rounded-lg border-gray-200 text-center dark:bg-gray-800"
                    @change="changeQuantity(products)">
                </td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(products.price) }}</td>
                <td class="px-3 py-2 whitespace-no-wrap">{{ formatCurrency(products.amount) }}</td>
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
              <div class="sub_total flex justify-between mt-3">
                <p>PPN</p>
                <p>{{ formatCurrency(ppn) }}</p>
              </div>
              <div class="sub_total flex justify-between mt-3">
                <p>Grand Total</p>
                <p>{{ formatCurrency(grand_total) }}</p>
              </div>
              <input type="text" v-model="code_invoice" hidden>
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
  Invoice,
  InvoiceAdd,
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
    const { user } = useAuthStore();
    return {
      id: null,
      user: user,
      salesOrders: [],
      deliveryOrders: [],
      employee: [],
      delivery_order_details: [],
      code_invoice: '',
      id_so: null,
      id_do: null,
      customer_id: null,
      employee_id: null,
      po_number: '',
      total: 0,
      customer_name: '',
      customer_npwp: 0,
      customer_address: '',
      employee_name: '',
      checklist_prod: 0,
      issue_at: '',
      due_at: '',
      isSubmitting: false,
      rules: {
        id_so: false,
        delivery_order_details: false,
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
    } else {
      this.issue_at = new Date().toLocaleDateString('en-CA');
    }
  },
  computed: {
    // Calculate subtotal based on all items in sales_order_details
    sub_total() {
      return this.delivery_order_details.reduce((total, item) => {
        return total + (item.amount) || 0
      }, 0);
    },
    ppn() {
      return this.sub_total * 0.11;
    },
    grand_total() {
      return this.sub_total + this.ppn;
    }
  },
  methods: {
    changeQuantity(products) {
      products.amount = products.price * products.quantity;
    },
    getSalesOrder() {
      axios.get(SalesOrders).then((res) => {
        var data = res.data;
        data = data.filter((detail) => detail.has_invoice == 0);
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
      axios.get(DeliverSales + '/' + id).then((res) => {
        var data = res.data
        data = data.filter(detail => detail.has_inv == 0);
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
      if (this.id_do == '' || this.id_do == null) {
        Swal.fire({
          icon: 'warning',
          text: 'Pilih Delivery Order'
        });
      } else {
        axios.get(DetailDo + '/' + this.id_do).then(
          (res) => {
            var data = res.data;
            for (let i = 0; i < data.length; i++) {
              var object = {
                id_so: this.id_so,
                id_detail_so: data[i].id_detail_so,
                id_detail_po: data[i].id_detail_po,
                id_detail_do: data[i].id_detail_do,
                id_do: data[i].id_do,
                code_do: data[i].do.code_do,
                product_id: data[i].product_id,
                product_desc: data[i].product.product_desc,
                product_pn: data[i].product.product_sn,
                product_brand: data[i].product.product_brand,
                quantity: data[i].quantity,
                price: data[i].price,
                amount: data[i].price * data[i].quantity,
              }
              this.delivery_order_details.push(object);
            }
          }
        )
      }
      console.log(this.delivery_order_details);
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
    getDetailSo(id) {
      axios.get(DetailInvoice + '/' + id).then(
        (res) => {
          var data = res.data;
          for (let i = 0; i < data.length; i++) {
            var object = {
              id_do: data[i].id_do,
              id_detail_invoice: data[i].id_detail_invoice,
              code_do: data[i].do.code_do,
              product_id: data[i].product_id,
              product_desc: data[i].product.product_desc,
              product_pn: data[i].product.product_sn,
              product_brand: data[i].product.product_brand,
              quantity: data[i].quantity,
              price: data[i].price,
              amount: data[i].price * data[i].quantity,
            }
            this.delivery_order_details.push(object);
          }
        }
      )
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

    async validation() {
      var count = 0;
      if (this.id_so == '' || this.id_so == null) {
        this.rules.id_so = true;
        count++
      } else {
        this.rules.id_so = false;
      }

      if (this.delivery_order_details.length == 0) {
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
      return count;
    },

    async onSubmit() {
      var total = this.sub_total;
      const result = await this.validation();
      if (result == 0) {
        if (this.id == null) {
          await axios.post(InvoiceAdd, {
            id_so: this.id_so,
            customer_id: this.customer_id,
            employee_id: this.employee_id,
            sub_total: this.sub_total,
            ppn: this.ppn,
            grand_total: this.grand_total,
            issue_at: this.issue_at,
            due_at: this.due_at,
            id_do: this.id_do,
            delivery_order_details: this.delivery_order_details,
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
        else {
          await axios.put(InvoiceAdd + '/' + this.id, {
            id_so: this.id_so,
            customer_id: this.customer_id,
            employee_id: 1,
            issue_at: this.issue_at,
            due_at: this.due_at,
            id_do: this.id_do,
            sub_total: total,
            code_invoice: this.code_invoice,
            delivery_order_details: this.delivery_order_details,
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