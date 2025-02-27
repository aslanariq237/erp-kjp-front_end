<template>
    <AdminLayout>
        <Form @submit="onSubmit">
            <div class="">
                <div class="flex justify-between items-center shadow-lg rounded-lg p-4">
                    <div class="card">
                        <p class="text-xl font-semibold">Form Employee</p>
                        <p class="text-gray-400">Master Data - Employee - Form</p>
                    </div>
                </div>
                <div class="flex justify-between gap-10 mt-4">
                    <div class="input shadow-lg rounded-lg p-4 w-full">
                        <div class="field mt-5 text-lg font-semibold text-gray-800">
                            <div class="flex justify-between align-top gap-5">
                                <div class="employee-name w-full">
                                    <label>Employee Name<label class="text-red-500">*</label></label>
                                    <input type="text" id="employee_name" name="employee_name"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Insert Employee Name"
                                        v-model="employee_name">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.employee_name == true">
                                                Employee Name is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="employee-phone w-full">
                                    <label>Employee Phone<label class="text-red-500">*</label></label>
                                    <input type="text" id="employee_phone" name="employee_phone"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Insert Employee Phone"
                                        v-model="employee_phone">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.employee_phone == true">
                                                Employee Phone is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between gap-5 align-top mt-3">
                                <div class="employee-email w-full">
                                    <label>Email<label class="text-red-500">*</label></label>
                                    <input type="text" id="employee_email" name="employee_email"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan employee Email"
                                        v-model="employee_email">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.employee_email == true">
                                                Employee Email is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="employee-address w-full">
                                    <label>Employee Address<label class="text-red-500">*</label></label>
                                    <input type="text" id="employee_address" name="employee_address"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan employee Address"
                                        v-model="employee_address">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic"
                                                v-if="rules.employee_address == true">
                                                Employee Address is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-between gap-5 align-top mt-3">
                                <div class="nik w-full">
                                    <label>nik<label class="text-red-500">*</label></label>
                                    <input type="text" id="nik" name="nik" class="w-full rounded-md px-3 py-3 my-2"
                                        placeholder="Masukkan nik" v-model="nik">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.nik == true">
                                                nik is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="position w-full">
                                    <label>Position<label class="text-red-500">*</label></label>
                                    <input type="text" id="position" name="position"
                                        class="w-full rounded-md px-3 py-3 my-2" placeholder="Masukkan position"
                                        v-model="position">
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <p class="text-red-400 text-md italic" v-if="rules.position == true">
                                                Position is required
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="btn flex justify-center items-center gap-5 shadow-md w-60 rounded-md">
                        <div class="contain">
                            <div class="btn">
                                <RouterLink to="/employee" class="p-10 py-3 text-xl cursor-pointer ">Cancel</RouterLink>
                            </div>
                            <div class="btn">
                                <button type="submit"
                                    class="text-xl bg-green-400 p-10 py-3 mt-10 rounded-md text-white">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Form>
    </AdminLayout>
</template>
<script>
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { EmployeeCode } from '@/core/utils/url_api';
import router from '@/router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Form, Field, ErrorMessage } from "vee-validate";
import { RouterLink } from 'vue-router';


export default {
    name: "assets-forms",
    components: {
        AdminLayout,
        Form,
    },
    data() {
        return {
            id_employee: "",
            employee_name: "",
            employee_phone: 0,
            employee_email: "",
            employee_address: "",
            nik: 0,
            position: "",
            rules: {
                employee_name: false,
                employee_phone: false,
                employee_email: false,
                employee_address: false,
                nik: false,
                position: false
            }
        }
    },
    methods: {
        async validation() {
            var count = 0;
            if (this.employee_name == "" || this.employee_name == null) {
                this.rules.employee_name = true;
                count++;
            } else {
                this.rules.employee_name = false;
            }

            if (this.employee_phone == "" || this.employee_phone == null) {
                this.rules.employee_phone = true;
                count++;
            } else {
                this.rules.employee_phone = false
            }

            if (this.employee_email == "" || this.employee_email == null) {
                this.rules.employee_email = true;
                count++;
            } else {
                this.rules.employee_email = false;
            }
            if (this.employee_address == "" || this.employee_address == null) {
                this.rules.employee_address = true;
                count++;
            } else {
                this.rules.employee_address = false;
            }

            if (this.nik == null) {
                this.rules.nik = true;
                count++;
            } else {
                this.rules.nik = false;
            }

            if (this.position == "" || this.position == null) {
                this.rules.position = true;
                count++
            } else {
                this.rules.position = false;
            }

            return count
        },
        async onSubmit() {
            const result = await this.validation();

            if (result == 0) {
                await axios.post(EmployeeCode, {
                    employee_name: this.employee_name,
                    employee_phone: this.employee_phone,
                    employee_email: this.employee_email,
                    employee_address: this.employee_address,
                    nik: parseInt(this.nik) || 0,
                    position: this.position
                }).then((response) => {
                    Swal.fire({
                        icon: "success",
                        title: 'Success',
                        text: "Data has been Saved"
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            var mssg = "";
                            if (this.id != null) {
                                mssg = "Success Update Employee";
                            } else {
                                mssg = "Success Create Employee";
                            }
                            await router.push("/employee");
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
        }
    }
}
</script>