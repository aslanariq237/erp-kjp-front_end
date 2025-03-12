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
            <RouterLink to="/vendor" class="px-3 py-3 my-2 text-lg cursor-pointer"
              >Cancel</RouterLink
            >
            <div class="btn">
              <button type="submit" class="bg-green-400 px-3 py-2 rounded-md text-white">
                Submit
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <FormGroup
              label="Account Name"
              :required="true"
              :error="rules.account_name"
              errorMessage="Account Name is required"
            >
              <input
                type="text"
                id="account_name"
                name="account_name"
                v-model="account_name"
                :class="inputClass(rules.account_name)"
              />
            </FormGroup>

            <FormGroup
              label="Vendor Name"
              :required="true"
              :error="rules.vendor_name"
              errorMessage="Vendor Name is required"
            >
              <input
                type="text"
                id="vendor_name"
                name="vendor_name"
                v-model="vendor_name"
                :class="inputClass(rules.vendor_name)"
              />
            </FormGroup>

            <FormGroup
              label="Vendor Type"
              :required="true"
              :error="rules.vendor_type"
              errorMessage="Vendor Type is required"
            >
              <input
                type="text"
                id="vendor_type"
                name="vendor_type"
                v-model="vendor_type"
                :class="inputClass(rules.vendor_type)"
              />
            </FormGroup>

            <FormGroup
              label="Vendor Email"
              :required="true"
              :error="rules.vendor_email"
              errorMessage="Vendor Email is required"
            >
              <input
                type="email"
                id="vendor_email"
                name="vendor_email"
                v-model="vendor_email"
                :class="inputClass(rules.vendor_email)"
              />
            </FormGroup>

            <FormGroup
              label="Vendor Phone"
              :required="true"
              :error="rules.vendor_phone"
              errorMessage="Vendor Phone is required"
            >
              <input
                type="text"
                id="vendor_phone"
                name="vendor_phone"
                v-model="vendor_phone"
                :class="inputClass(rules.vendor_phone)"
              />
            </FormGroup>

            <FormGroup
              label="Vendor Address"
              :required="true"
              :error="rules.vendor_address"
              errorMessage="Vendor Address is required"
            >
              <input
                type="text"
                id="vendor_address"
                name="vendor_address"
                v-model="vendor_address"
                :class="inputClass(rules.vendor_address)"
              />
            </FormGroup>

            <FormGroup
              label="Tax Number"
              :required="true"
              :error="rules.tax_number"
              errorMessage="Tax Number is required"
            >
              <input
                type="text"
                id="tax_number"
                name="tax_number"
                v-model="tax_number"
                :class="inputClass(rules.tax_number)"
              />
            </FormGroup>

            <FormGroup
              label="Contact Person"
              :required="true"
              :error="rules.contact_person"
              errorMessage="Contact Person is required"
            >
              <input
                type="text"
                id="contact_person"
                name="contact_person"
                v-model="vendor_contact"
                :class="inputClass(rules.contact_person)"
              />
            </FormGroup>
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
import Swal from 'sweetalert2'
import { AddVendor } from '@/core/utils/url_api' // Pastikan ini sesuai path-nya
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import FormGroup from '@/components/FormGroup.vue'

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
      account_name: '',
      vendor_name: '',
      vendor_type: '',
      vendor_phone: '',
      vendor_email: '',
      vendor_address: '',
      tax_number: '',
      vendor_npwp: '',
      vendor_contact: '',
      vendor_details: [],

      rules: {
        account_name: false,
        vendor_name: false,
        vendor_type: false,
        vendor_phone: false,
        vendor_email: false,
        vendor_address: false,
        tax_number: false,
        contact_person: false,
      },
    }
  },
  async mounted() {
    const route = useRoute()
    const id = route.params.id

    // if (id) {
    //   this.id = id;
    //   this.getById(id);
    // }else{

    // }
  },
  methods: {
    async validation() {
      var count = 0
      if (this.account_name == '' || this.account_name == null) {
        this.rules.account_name = true
        count++
      } else {
        this.rules.account_name = false
      }

      if (this.vendor_name == '' || this.vendor_name == null) {
        this.rules.vendor_name = true
        count++
      } else {
        this.rules.vendor_name = false
      }

      if (this.vendor_type == '' || this.vendor_type == null) {
        this.rules.vendor_type = true
        count++
      } else {
        this.rules.vendor_type = false
      }

      if (this.vendor_phone == '' || this.vendor_phone == null) {
        this.rules.vendor_phone = true
        count++
      } else {
        this.rules.vendor_phone = false
      }

      if (this.vendor_email == '' || this.vendor_email == null) {
        this.rules.vendor_email = true
        count++
      } else {
        this.rules.vendor_email = false
      }

      if (this.vendor_address == '' || this.vendor_address == null) {
        this.rules.vendor_address = true
        count++
      } else {
        this.rules.vendor_address = false
      }

      if (this.tax_number == '' || this.tax_number == null) {
        this.rules.tax_number = true
        count++
      } else {
        this.rules.tax_number = false
      }

      if (this.vendor_contact == '' || this.vendor_contact == null) {
        this.rules.contact_person = true
        count++
      } else {
        this.rules.contact_person = false
      }

      return count
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

    addPoDetails() {
      var object = {
        no: this.code + 1,
        point: this.point,
        alamat: this.alamat,
      }
      this.vendor_details.push(object)
      this.code++
    },

    getById() {},
    async onSubmit() {
      const result = await this.validation()

      if (result == 0) {
        await axios
          .post(AddVendor, {
            account_name: this.account_name,
            vendor_name: this.vendor_name,
            vendor_type: this.vendor_type,
            vendor_phone: this.vendor_phone,
            vendor_email: this.vendor_email,
            vendor_address: this.vendor_address,
            tax_number: this.tax_number,
            vendor_details: this.vendor_details,
          })
          .then(
            (response) => {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Vendor Data has been Saved',
              }).then(async (result) => {
                if (result.isConfirmed) {
                  var mssg = ''
                  if (this.id != null) {
                    mssg = 'Success Update Vendor'
                  } else {
                    mssg = 'Success Create Vendor'
                  }
                  await router.push('/vendor')
                  this.alertStore.success(mssg)
                }
              })
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
  },
})
</script>
