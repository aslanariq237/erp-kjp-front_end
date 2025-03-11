<template>
  <AdminLayout>
    <Form @submit="onSubmit">
      <div>
        <div class="flex justify-between items-center rounded-lg shadow-lg p-4">
          <div class="card">
            <p class="text-xl font-semibold">Form Customer</p>
            <p class="text-gray-400">Master Data / Customer / Form</p>
          </div>
          <div class="btn flex justify-between items-center gap-3 text-lg">
            <RouterLink to="/customer" class="px-3 py-3 my-2 text-lg cursor-pointer">Cancel</RouterLink>
            <div class="btn">
              <button type="submit" class="bg-green-400 px-3 py-2 rounded-md text-white">
                Submit
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <FormGroup label="Customer Name" :required="true" :error="rules.issue_at"
              errorMessage="Issue Date is required">
              <input 
                type="text" 
                id="customer_name" 
                name="customer_name" 
                v-model="customer_name"
                @change="singkatan"
                :class="inputClass(rules.issue_at)" />
            </FormGroup>

            <!-- Due Date -->
            <FormGroup label="Customer Phone" :required="true" :error="rules.due_at"
              errorMessage="Due Date is required">
              <input type="text" id="customer_phone" name="customer_phone" v-model="customer_phone"
                :class="inputClass(rules.due_at)" />
            </FormGroup>           

            <!-- No -->
            <FormGroup label="Customer Email" :required="false" :error="rules.due_at"
              errorMessage="Due Date is required">
              <input type="text" id="customer_email" name="customer_email" v-model="customer_email"
                :class="inputClass(rules.due_at)" />
            </FormGroup>
            <!-- Code PO -->

            <!-- Total Service -->
            <FormGroup label="Customer Address" :required="true" :error="rules.deposit"
              errorMessage="Deposit is required">
              <input type="text" id="customer_address" name="customer_address" v-model="customer_address"
                :class="inputClass(rules.deposit)" placeholder="Insert Customer Address" />
            </FormGroup>

            <!-- Due Date -->
            <FormGroup label="Customer NPWP" :required="false" :error="rules.due_at" errorMessage="Due Date is required">
              <input type="number" id="customer_npwp" name="customer_npwp" v-model="customer_npwp"
                :class="inputClass(rules.due_at)" />
            </FormGroup>

            <FormGroup label="Contact Person" :required="true" :error="rules.deposit"
              errorMessage="Deposit is required">
              <input type="text" id="contact_person" name="contact_person" v-model="customer_contact"
                :class="inputClass(rules.deposit)" placeholder="Insert Contact Person" />
            </FormGroup>
            <FormGroup>              
            </FormGroup>
          </div>
          <div class="flex justify-content-between gap-4 items-end">
            <!-- Grand Total -->
            <FormGroup class="w-full" label="Point" :required="true" :error="rules.quantity"
              errorMessage="Quantity is required">
              <input type="text" id="quantity" name="point" v-model="point" :class="inputClass(rules.quantity)"
                placeholder="Enter Customer Point" />
            </FormGroup>
            <FormGroup class="w-full" label="Address" :required="true" :error="rules.quantity"
              errorMessage="Price is required">
              <input type="text" id="quantity" name="alamat" v-model="alamat" :class="inputClass(rules.quantity)"
                placeholder="Enter Customer Address" />
            </FormGroup>
            <button type="button" class="border-gray-300 border-2 px-3 h-12 rounded-lg"
              @click="addPoDetails">tambah</button>
          </div>
          <div class=" mt-5">
            <table class="min-w-full divide-y divide-gray-100 shadow-sm border-gray-200 border">
              <thead>
                <tr class="text-left">
                  <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Code</th>
                  <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Point</th>
                  <th class="px-3 py-2 font-semibold text-left bg-gray-100 border-b">Alamat</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr v-for="poDetail in customer_details" :key="poDetail.product_id">
                  <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.no }}</td>
                  <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.point }}</td>
                  <td class="px-3 py-2 whitespace-no-wrap">{{ poDetail.alamat }}</td>
                </tr>
              </tbody>
            </table>
          </div>          
        </div>
      </div>
    </Form>
  </AdminLayout>
</template>

<script>
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import router from '@/router'
import axios from 'axios'
import Swal from "sweetalert2"
import { AddCustomer } from '@/core/utils/url_api' // Pastikan ini sesuai path-nya
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import FormGroup from '@/components/FormGroup.vue'

export default defineComponent({
  name: 'assets-forms',
  components: {
    AdminLayout,
    Form,
    Field,
    ErrorMessage,
    FormGroup
  },
  data() {
    return {
      customer_name: '',
      customer_phone: 0,
      customer_email: '',      
      customer_singkatan: '',
      customer_address: '',
      customer_npwp : 0,
      customer_contact: '',
      point: '',
      alamat: '',
      code: 1000,
      customer_details: [],

      rules: {
        customer_name: false,
        customer_phone: false,
        customer_email: false,
        customer_address: false,
        npwp: false,
        contact_person: false,
      },
    }
  },
  async mounted() {
    const route = useRoute();
    const id = route.params.id;

    // if (id) {
    //   this.id = id;
    //   this.getById(id);
    // }else{

    // }
  },
  methods: {
    async validation() {
      var count = 0;
      if (this.customer_name == "" || this.customer_name == null) {
        this.rules.customer_name = true;
        count++
      } else {
        this.rules.customer_name = false;
      }

      if (this.customer_phone == null && this.customer_phone <= 16) {
        this.rules.customer_phone = true;
        count++;
      } else {
        this.rules.customer_phone = false;
      }

      if (this.customer_email == "" || this.customer_email == null) {
        this.rules.customer_email = true;
        count++;
      } else {
        this.rules.customer_email = false;
      }

      if (this.customer_npwp == null && this.customer_npwp <= 16) {
        this.rules.npwp = true;
        count++;
      } else {
        this.rules.npwp = false;
      }

      if (this.customer_contact == "" || this.customer_contact == null) {
        this.rules.contact_person = true;
        count++;
      } else {
        this.rules.contact_person = false;
      }

      return count;
    },
    inputClass(error) {
      return [
        'w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
        error
          ? 'border-red-300 focus:ring-red-500 bg-red-50'
          : 'border-gray-300 focus:ring-blue-500',
      ]
    },

    createSingkatan(input) {
      const ignoreWords = [
        'PT.', 'PT', 'pt', 'CV.', 'CV', 'UD. ', 'UD', 'TBK.', 'TBK',
        'INC.', 'INC', 'inc', 'cv', 'ud', 'tbk'
      ];

      const words = input.split(' ');
      const abbreviation = words
        .filter(word => !ignoreWords.includes(word.toUpperCase()))
        .map(word => word.charAt(0).toUpperCase())
        .join('');
      return abbreviation;
    },

    singkatan() {
      this.customer_singkatan = this.createSingkatan(this.customer_name);
    },

    addPoDetails() {
      var object = {
        no: this.code + 1,
        point: this.point,
        alamat: this.alamat
      };
      this.customer_details.push(object)
      this.code++;
    },

    getById() { },
    async onSubmit() {
      const result = 2

      if (result != 0) {        
        await axios.post(
          AddCustomer, {
          customer_name: this.customer_name,
          customer_phone: parseInt(this.customer_phone) || 0,          
          customer_singkatan: this.customer_singkatan,
          customer_email: this.customer_email,
          customer_address: this.customer_address,
          customer_npwp: this.customer_npwp,
          customer_contact: this.customer_contact,
          customer_details: this.customer_details,
        }
        ).then((response) => {
          Swal.fire({
            icon: "success",
            title: 'Success',
            text: "Customer Data has been Saved"
          }).then(async (result) => {
            if (result.isConfirmed) {
              var mssg = "";
              if (this.id != null) {
                mssg = "Success Update Purchase Order";
              } else {
                mssg = "Success Create Purchase Order";
              }
              await router.push("/customer");
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

      // try {


      //   // Tampilkan notifikasi sukses (jika menggunakan library toast, bisa pakai ini)

      //   // Redirect atau reset form setelah submit        
      // } catch (error) {
      //   if (error.response) {
      //     // Server responded dengan status di luar 2xx
      //     alert(`Gagal: ${error.response.data.message || 'Terjadi kesalahan'}`)
      //   } else if (error.request) {
      //     // Request dikirim tapi tidak ada respons
      //     alert('Tidak ada respon dari server, cek koneksi!')
      //   } else {
      //     // Error lainnya
      //     alert(`Error: ${error.message}`)
      //   }
      //   console.error('Error adding customer:', error)
      // }
    },
  },
})
</script>
