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
                    <FormGroup label="Employee Name" :required="true">
                        <input type="text" id="issue_at" name="issue_at" v-model="employee_name"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.employee_name == true">
                            <p class="text-red-500 text-sm">Name Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Employee Phone" :required="true">
                        <input type="number" id="issue_at" name="issue_at" v-model="employee_phone"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.employee_phone == true">
                            <p class="text-red-500 text-sm">Phone Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Employee Email" :required="true">
                        <input type="text" id="issue_at" name="issue_at" v-model="employee_email"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.employee_email == true">
                            <p class="text-red-500 text-sm">Email Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Employee Nik" :required="true">
                        <input type="number" id="issue_at" name="issue_at" v-model="employee_nik"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.employee_nik == true">
                            <p class="text-red-500 text-sm">NIK Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Employee Position" :required="true">
                        <input type="text" id="issue_at" name="issue_at" v-model="employee_position"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.employee_position == true">
                            <p class="text-red-500 text-sm">Position Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Employee Address" :required="true">
                        <input type="text" id="issue_at" name="issue_at" v-model="employee_address"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.employee_address == true">
                            <p class="text-red-500 text-sm">Address Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Bpjs Kesehatan" :required="true">
                        <input type="text" id="issue_at" name="issue_at" v-model="bpjs_kesehatan"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.bpjs_kesehatan == true">
                            <p class="text-red-500 text-sm">BPJS Kesehatan Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Bpjs Ketenagakerjaan" :required="true">
                        <input type="text" id="issue_at" name="issue_at" v-model="bpjs_ketenagakerjaan"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.bpjs_ketenagakerjaan == true">
                            <p class="text-red-500 text-sm">bpjs Ketenagakerjaan Dibutuhkan</p>
                        </div>
                    </FormGroup>
                    <FormGroup label="Salary" :required="true">
                        <input type="text" id="issue_at" name="issue_at" v-model="employee_salary"
                            :class="inputClass(rules.issue_at)" />
                        <div v-if="rules.employee_salary == true">
                            <p class="text-red-500 text-sm">Salary Dibutuhkan</p>
                        </div>
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
import { Employee, EmployeeCode } from '@/core/utils/url_api'
import router from '@/router'
import { useRoute } from 'vue-router'

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
            id : null,
            employee_name: '',
            employee_phone: 0,
            employee_email: '',
            employee_nik: 0,
            employee_position: '',
            employee_address: '',
            bpjs_kesehatan: '',
            bpjs_ketenagakerjaan: '',
            employee_salary: 0,
            //others
            isSubmitting: false,
            notification: {
                show: false,
                type: 'success',
                message: '',
            },
            rules: {
                employee_name: false,
                employee_phone: false,
                employee_email: false,
                employee_nik: false,
                employee_position: false,
                employee_address: false,
                bpjs_kesehatan: false,
                bpjs_ketenagakerjaan: false,
                employee_salary: false,
            },
            sales_order_details: [],
        }
    },
    mounted() {
        const route = useRoute();
        const id = route.params.id;

        if (id) {
            this.getById(id)
            this.id = id;
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
            if (this.employee_name == '' || this.employee_name == null) {
                this.rules.employee_name = true;
                count++;
            }else{
                this.rules.employee_name = false;
            }

            if (this.employee_phone == '' || this.employee_phone == null) {
                this.rules.employee_phone = true;
                count++;
            }else{
                this.rules.employee_phone = false;                
            }

            if (this.employee_email == '' || this.employee_email == null) {
                this.rules.employee_email = true;
                count++;
            }else{
                this.rules.employee_email = false;
            }

            if (this.employee_address == '' || this.employee_address == null) {
                this.rules.employee_address = true;
                count++;
            }else{
                this.rules.employee_address = false;
            }

            if (this.employee_nik == '' || this.employee_nik == null) {
                this.rules.employee_nik =true;
                count++;
            }else{
                this.rules.employee_nik = false;
            }

            if (this.employee_position == '' || this.employee_position == null) {
                this.rules.employee_nik = true;
                count++;
            }else{
                this.rules.employee_nik = false;
            }

            if (this.bpjs_kesehatan == '' || this.bpjs_kesehatan == null) {
                this.rules.bpjs_kesehatan = true;
                count++;
            }else{
                this.rules.bpjs_kesehatan = false;
            }

            if (this.bpjs_ketenagakerjaan == '' || this.bpjs_ketenagakerjaan == null) {
                this.rules.bpjs_ketenagakerjaan = true;
                count++;
            }else{
                this.rules.bpjs_ketenagakerjaan = false;
            }

            if (this.employee_salary == '' || this.employee_salary == null) {
                this.rules.employee_salary = true;
                count++
            }else{
                this.rules.employee_salary = false;
            }
            return count
        },

        async getById(id) {
            await axios.get(Employee + '/' + id).then(
                (res) => {
                    var data = res.data;
                    this.employee_name = data.employee_name;
                    this.employee_phone = data.employee_phone;
                    this.employee_email = data.employee_email;
                    this.employee_nik = data.employee_nik;
                    this.employee_position = data.employee_position;
                    this.employee_address = data.employee_address;
                    this.bpjs_kesehatan = data.bpjs_kesehatan;
                    this.bpjs_ketenagakerjaan = data.bpjs_ketenagakerjaan;
                    this.employee_salary = data.employee_salary;
                }
            )
        },

        async onSubmit() {
            const result = 2
            if (result != 0) {
                if (this.id) {
                    await axios
                    .put(EmployeeCode + '/' + this.id, {
                        employee_name: this.employee_name,
                        employee_phone: this.employee_phone,
                        employee_email: this.employee_email,
                        employee_nik: this.employee_nik,
                        employee_position: this.employee_position,
                        employee_address: this.employee_address,
                        employee_salary: this.employee_salary,
                        bpjs_kesehatan: this.bpjs_kesehatan,
                        bpjs_ketenagakerjaan: this.bpjs_ketenagakerjaan,
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
                }else{
                    await axios
                    .post(EmployeeCode, {
                        employee_name: this.employee_name,
                        employee_phone: this.employee_phone,
                        employee_email: this.employee_email,
                        employee_nik: this.employee_nik,
                        employee_position: this.employee_position,
                        employee_address: this.employee_address,
                        employee_salary: this.employee_salary,
                        bpjs_kesehatan: this.bpjs_kesehatan,
                        bpjs_ketenagakerjaan: this.bpjs_ketenagakerjaan,
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