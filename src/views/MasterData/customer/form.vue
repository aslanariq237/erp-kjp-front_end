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
        <div class="input rounded-lg shadow-lg p-4 mt-4">
          <div class="field mt-3 text-lg font-semibold">
            <div class="flex justify-between align-top gap-5 shadow-lg">
              <div class="customer-name w-full">
                <label>Name Customer</label>
                <input type="text" id="customer_name" name="customer_name" class="w-full rounded-md px-3 py-3 my-2"
                  placeholder="Insert Customer Name" v-model="customer_name" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <p class="text-red-400 text-md italic" v-if="rules.customer_name">
                      Customer Name is required
                    </p>
                  </div>
                </div>
              </div>
              <div class="customer-phone w-full">
                <label>Customer Phone</label>
                <input type="text" id="customer_phone" name="customer_phone" class="w-full rounded-md px-3 py-3 my-2"
                  placeholder="Insert Customer Phone" v-model="customer_phone" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <p class="text-red-400 text-md italic" v-if="rules.customer_phone">
                      Customer Phone is required
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between gap-5 align-top mt-3">
              <div class="customer-email w-full">
                <label>Email</label>
                <input type="text" id="customer_email" name="customer_email" class="w-full rounded-md px-3 py-3 my-2"
                  placeholder="Masukkan Customer Email" v-model="customer_email" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <p class="text-red-400 text-md italic" v-if="rules.customer_email">
                      Customer Email is required
                    </p>
                  </div>
                </div>
              </div>
              <div class="customer-address w-full">
                <label>Customer Address</label>
                <input type="text" id="customer_address" name="customer_address" class="w-full rounded-md px-3 my-2"
                  placeholder="Masukkan Customer Address" v-model="customer_address" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <p class="text-red-400 text-md italic" v-if="rules.customer_address">
                      Customer Address is required
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between gap-5 align-top mt-3">
              <div class="NPWP w-full">
                <label>NPWP</label>
                <input type="text" id="npwp" name="npwp" class="w-full rounded-md px-3 my-2" placeholder="Masukkan NPWP"
                  v-model="npwp" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <p class="text-red-400 text-md italic" v-if="rules.npwp">NPWP is required</p>
                  </div>
                </div>
              </div>
              <div class="contact-person w-full">
                <label>Contact Person</label>
                <input type="text" id="contact_person" name="contact_person" class="w-full rounded-md px-3 my-2"
                  placeholder="Masukkan contact-person" v-model="contact_person" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <p class="text-red-400 text-md italic" v-if="rules.contact_person">
                      Contact Person is required
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

export default defineComponent({
  name: 'assets-forms',
  components: {
    AdminLayout,
    Form,
    Field,
    ErrorMessage
  },
  data() {
    return {
      customer_name: '',
      customer_phone: 0,
      customer_email: '',
      customer_address: '',
      npwp: '',
      contact_person: '',
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

      if (this.customer_phone == "" || this.customer_phone == null) {
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

      if (this.npwp == "" || this.npwp == null) {
        this.rules.npwp = true;
        count++;
      } else {
        this.rules.npwp = false;
      }

      if (this.contact_person == "" || this.contact_person == null) {
        this.rules.contact_person = true;
        count++;
      } else {
        this.rules.contact_person = false;
      }

      return count;
    },
    getById() { },
    async onSubmit() {
      const result = await this.validation();

      if (result == 0) {
        await axios.post(
          AddCustomer, {
          customer_name: this.customer_name,
          customer_phone: this.customer_phone,
          customer_email: this.customer_email,
          customer_address: this.customer_address,
          npwp: this.npwp,
          contact_person: this.contact_person
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
