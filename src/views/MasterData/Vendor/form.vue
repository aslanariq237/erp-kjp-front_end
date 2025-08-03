<template>
  <AdminLayout>
    <Form @submit="onSubmit">
      <div>
        <div class="flex justify-between items-center rounded-lg shadow-lg p-4">
          <div class="card">
            <p class="text-xl font-semibold">Form vendor</p>
            <p class="text-gray-400">Master Data / vendor / Form</p>
          </div>
          <div class="btn flex justify-between items-center gap-3 text-lg">
            <RouterLink to="/vendor" class="px-3 py-3 my-2 text-lg cursor-pointer">Cancel</RouterLink>
            <div class="btn">
              <button type="submit" class="bg-green-400 px-3 py-2 rounded-md text-white">
                Submit
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <FormGroup 
              label="vendor Name" 
              :required="true" 
              :error="rules.vendor_name"
              errorMessage="Nama Vendor Dibutuhkan">
              <input type="text" autocomplete="off" id="vendor_name" name="vendor_name" v-model="vendor_name" @input="singkatan"
                :class="inputClass(rules.issue_at)" />
            </FormGroup>

            <!-- Due Date -->
            <FormGroup 
              label="vendor Phone" 
              :required="true" 
              :error="rules.vendor_phone" 
              errorMessage="Nomor Vendor Dibutuhkan">
              <input type="text" id="vendor_phone" name="vendor_phone" v-model="vendor_phone"
                :class="inputClass(rules.due_at)" />
            </FormGroup>

            <!-- No -->
            <FormGroup 
              label="vendor Email" 
              :required="true" 
              :error="rules.vendor_email" 
              errorMessage="Email Vendor Dibutuhkan">
              <input type="text" id="vendor_email" name="vendor_email" v-model="vendor_email"
                :class="inputClass(rules.due_at)" />
            </FormGroup>
            <!-- Code PO -->

            <!-- Total Service -->
            <FormGroup 
              label="vendor Address" 
              :required="true" 
              :error="rules.vendor_address"
              errorMessage="Alamat Vendor Dibutuhkan">
              <input type="text" id="vendor_address" name="vendor_address" v-model="vendor_address"
                :class="inputClass(rules.deposit)" placeholder="Insert vendor Address" />
            </FormGroup>

            <!-- Due Date -->
            <FormGroup 
              label="vendor NPWP" 
              :required="true" 
              :error="rules.vendor_npwp" 
              errorMessage="NPWP Vendor Dibutuhkan">
              <input type="number" id="vendor_npwp" name="vendor_npwp" v-model="vendor_npwp" @input="singkatan"
                :class="inputClass(rules.due_at)" />
            </FormGroup>

            <FormGroup 
              label="Contact Person" 
              :required="true" 
              :error="rules.contact_person"
              errorMessage="Contact Person Dibutuhkan">
              <input type="text" id="contact_person" name="contact_person" v-model="vendor_contact"
                :class="inputClass(rules.deposit)" placeholder="Insert Contact Person" />
            </FormGroup>
            <FormGroup> </FormGroup>
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
import Swal from 'sweetalert2'
import { AddVendor, Vendor } from '@/core/utils/url_api' // Pastikan ini sesuai path-nya
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import FormGroup from '@/components/FormGroup.vue'
import ApiServices from '@/core/services/ApiServices'

export default defineComponent({
  name: 'assets-forms',
  components: {
    AdminLayout,
    Form,
    Field,
    ErrorMessage,
    FormGroup,
  },
  data() {
    return {
      id:null,
      vendor_name: '',
      vendor_phone: 0,
      vendor_email: '',
      vendor_toko: '',
      vendor_singkatan: '',
      vendor_address: '',
      vendor_npwp: 0,
      vendor_contact: '',
      point: '',
      alamat: '',

      rules: {
        vendor_name: false,
        vendor_phone: false,
        vendor_email: false,
        vendor_address: false,
        vendor_npwp: false,
        contact_person: false,
      },
    }
  },
  async mounted() {
    const route = useRoute()
    const id = route.params.id

    if (id) {      
      this.getById(id);
      this.id = id;
    }else{

    }
  },
  methods: {
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
        'PT.',
        'PT',
        'pt',
        'CV.',
        'CV',
        'UD. ',
        'UD',
        'TBK.',
        'TBK',
        'INC.',
        'INC',
        'inc',
        'cv',
        'ud',
        'tbk',
      ]

      const words = input.split(' ')
      const abbreviation = words
        .filter((word) => !ignoreWords.includes(word.toUpperCase()))
        .map((word) => word.charAt(0).toUpperCase())
        .join('')
      return abbreviation
    },

    singkatan() {
      this.vendor_singkatan = this.createSingkatan(this.vendor_name)
    },

    async validation() {
      var count = 0;
      if (this.vendor_name == "" || this.vendor_name == null) {
        this.rules.vendor_name = true;
        count++
      } else {
        this.rules.vendor_name = false;
      }

      if (this.vendor_phone == 0 && this.vendor_phone <= 16) {
        this.rules.vendor_phone = true;
        count++;
      } else {
        this.rules.vendor_phone = false;
      }

      if (this.vendor_email == "" || this.vendor_email == null) {
        this.rules.vendor_email = true;
        count++;
      } else {
        this.rules.vendor_email = false;
      }

      if (this.vendor_address == "" || this.vendor_address == null) {
        this.rules.vendor_address = true;
        count++
      } else {
        this.rules.vendor_address = false;
      }

      if (this.vendor_npwp == 0 && this.vendor_npwp <= 16) {
        this.rules.vendor_npwp = true;
        count++;
      } else {
        this.rules.vendor_npwp = false;
      }

      if (this.vendor_contact == "" || this.vendor_contact == null) {
        this.rules.contact_person = true;
        count++;
      } else {
        this.rules.contact_person = false;
      }

      return count;
    },

    async getById(id) {
      await ApiServices.get(Vendor + '/' + id).then(
        (res) => {
          var data = res.data;
          this.vendor_name = data.vendor_name;
          this.vendor_phone = data.vendor_phone;
          this.vendor_email = data.vendor_email;
          this.vendor_address = data.vendor_address;
          this.vendor_npwp = data.vendor_npwp;
          this.vendor_singkatan = data.vendor_singkatan;
          this.vendor_contact = data.vendor_contact;          
        }
      )
    },
    async onSubmit() {
      const result = await this.validation();
      if (result == 0) {
        if (this.id) {
          await ApiServices.put(AddVendor + '/' + this.id, {
          vendor_name: this.vendor_name,
          vendor_phone: parseInt(this.vendor_phone) || 0,
          vendor_email: this.vendor_email,
          vendor_singkatan: this.vendor_singkatan,
          vendor_address: this.vendor_address,
          vendor_npwp: this.vendor_npwp,
          vendor_contact : this.vendor_contact,
        }).then(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'success save the data',
              text: 'Data Has Been Saved'
            }).then((res) => {
              if (res.isConfirmed) {
                router.push('/vendor');
              }
            })
          }, (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text:
                (error.response && error.response && error.response.message) ||
                error.message ||
                error.toString(),
            })
          }
        )
        }else{
          await ApiServices.post(AddVendor, {
          vendor_name: this.vendor_name,
          vendor_phone: parseInt(this.vendor_phone) || 0,
          vendor_email: this.vendor_email,
          vendor_singkatan: this.vendor_singkatan,
          vendor_address: this.vendor_address,
          vendor_npwp: this.vendor_npwp,
          vendor_contact : this.vendor_contact,
        }).then(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'success save the data',
              text: 'Data Has Been Saved'
            }).then((res) => {
              if (res.isConfirmed) {
                router.push('/vendor');
              }
            })
          }, (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text:
                (error.response && error.response && error.response.message) ||
                error.message ||
                error.toString(),
            })
          }
        )
        }
      }
    }
  }
})
</script>
